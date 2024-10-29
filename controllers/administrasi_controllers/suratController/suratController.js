const db = require('../../../models');
const mongoose = require('mongoose');
const WargaModel = db.administration_DB.warga;
const userModel = db.user_DB.user;
const suratAcaraModel = db.administration_DB.suratAcara;
const RtModel = db.administration_DB.rt;
const RwModel = db.administration_DB.rw;
const PerangkatDesaModel = db.administration_DB.PerangkatDesaModel;
const PimpinanDesa = db.administration_DB.pimpinanDesa;
const bcrypt = require('bcrypt');
const puppeteer = require('puppeteer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

const encrypt = require('../../../utils/encryptDecrypt');
const { createSubSurat } = require('./functions/suratCreatetor');
const generateSuratPDF = require('./functions/FormatSurat');
// const generateHTML = require('./functions/FormatSurat');
const { kasiDecider } = require('../../../middlewares/kasiDecider');
const { getKasiType } = require('../../../middlewares/kasiDecider');
const { setNomorSurat } = require('./functions/setNomorSurat');


exports.getAllSuratAcaraLessDetail_TAVERSION = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let arrDataSuratAcara = [];
        const limit = parseInt(req.query.limit) || 10;
        const dataSuratAcara = await suratAcaraModel.find()
            .limit(limit)
            .skip((page - 1) * limit);
        dataSuratAcara.forEach((suratAcara) => {
            arrDataSuratAcara.push({
                nameAcara: suratAcara.nameAcara,
                jenisSurat: suratAcara.jenisSurat,
                isiAcara: suratAcara.isiAcara,
                statusAcara: suratAcara.statusAcara,
                tanggalMulai: suratAcara.tanggalMulai,
                tanggalSelesai: suratAcara.tanggalSelesai,
            });
        });

        const dataTotal = await suratAcaraModel.countDocuments();
        res.status(200).send({
            message: "Success get all surat acara",
            data: arrDataSuratAcara,
            page: page,
            limit: limit,
            totalDocument: dataTotal
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while get all surat acara."
        });
    }
}


exports.getSuratAcaraMoreDetail_TAVERSION = async (req, res) => {
    try {
        const { idSurat } = req.params;

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while get all surat acara."
        });
    }
},


    exports.wargaCreateSurat_TAVERSION = async (req, res) => {
        try {
            const { idWarga } = req.params;
            const { nameAcara, jenisSurat, isiAcara, tanggalMulai, tanggalSelesai, tempatAcara, dataSubSurat } = req.body;

            const dataWarga = await WargaModel.findById(idWarga).populate('user');

            if (!dataWarga || !dataWarga.user) {
                return res.status(404).send({
                    message: "Warga not found or user property is missing"
                });
            }

            const Rt = await RtModel.findOne({ ketuaRt: dataWarga.user.domisili[0] }).populate('user');
            if (!Rt || Rt.length === 0) {
                return res.status(404).send({
                    message: "RT not found with domisili rt " + dataWarga.user.domisili[0]
                });
            }

            const Rw = await RwModel.findOne({ ketuaRw: dataWarga.user.domisili[1] }).populate('user');
            if (!Rw || Rw.length === 0) {
                return res.status(404).send({
                    message: "RW not found with domisili rw " + dataWarga.user.domisili[1]
                });
            }

            const rolePerangkatDesa = kasiDecider(jenisSurat);
            const Kasi = await PerangkatDesaModel.findOne({ rolePD: rolePerangkatDesa.role });

            const kades = await PimpinanDesa.findOne({ rolePemimpinDesa: 1 });
            if (!kades) {
                return res.status(404).send({
                    message: "Kades not found"
                });
            }

            //pengondisian jika kasi tidak ditemukan
            if (rolePerangkatDesa === "rolePd not found") {
                throw new Error(`Kasi administasi ${jenisSurat} not found`);
            }

            // Periksa apakah si surat acara dengan nama yang sama sudah ada
            const existingSuratAcara = await suratAcaraModel.findOne({
                nameAcara,
                wargaId: dataWarga._id
            });
            if (existingSuratAcara) {
                throw new Error(`Surat Acara with name ${nameAcara} already exists`);
            }

            // Buat surat acara baru
            const suratAcara = await suratAcaraModel.create({
                nameAcara,
                jenisSurat: jenisSurat.toLowerCase(),
                isiAcara,
                tanggalMulai,
                tanggalSelesai,
                tempatAcara,
                wargaId: dataWarga._id
            });

            // Tambahkan nomor surat ke surat acara
            suratAcara.nomorSurat = await setNomorSurat()

            // Tambahkan ID surat acara ke array suratAcara di warga
            dataWarga.suratAcara.push(suratAcara._id);
            await dataWarga.save();

            // Tambahkan ID surat acara ke array suratAcaraPending di Rt
            suratAcara.rtId = Rt._id;
            Rt.suratAcaraPending.push(suratAcara._id);
            await Rt.save();

            // Tambahkan ID surat acara ke array suratAcaraPending di Rw
            suratAcara.rwId = Rw._id;
            Rw.suratAcaraComing.push(suratAcara._id);
            await Rw.save();

            // Tambahkan ID surat acara ke array suratAcaraPending di Kasi
            suratAcara.perangkatDesaId = Kasi._id;
            Kasi.suratAcaraComing.push(suratAcara._id);
            await Kasi.save();

            // Tambahkan ID surat acara ke array suratAcaraComing di Kades
            suratAcara.pimpinanDesaId = kades._id;
            kades.suratAcaraComing.push(suratAcara._id);
            await kades.save();

            if (suratAcara.wargaId.toString() !== dataWarga._id.toString()) {
                return res.status(403).send({
                    message: "Forbidden. Surat Acara does not belong to the specified user."
                });
            }

            // Simpan surat acara
            await suratAcara.save();

            const subSurat = await createSubSurat(req, res, dataSubSurat, jenisSurat);

            suratAcara.subSuratId = subSurat._id;

            await suratAcara.save();

            res.status(200).send({
                message: "Success create surat acara",
                data: suratAcara
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send({
                message: error.message || "Some error occurred while creating Surat Acara."
            });
        }
    }

exports.generateSuratPdf_TAVERSION = async (req, res) => {
    try {
        const { idSuratAcara } = req.params;
        console.log(`idSuratAcara: ${idSuratAcara}`);

        const suratAcara = await suratAcaraModel.findById(idSuratAcara).populate('wargaId');
        console.log(`Surat Acara: ${suratAcara}`);

        if (!suratAcara) {
            return res.status(404).send({ message: `Surat Acara dengan id ${idSuratAcara} tidak ditemukan` });
        }

        const dataUser = await WargaModel.findById(suratAcara.wargaId).populate('user');
        console.log(`Data User: ${dataUser}`);

        const aesKey = crypto.scryptSync(process.env.encrypt_key_one, process.env.encrypt_key_two, 32);
        const iv = Buffer.from(dataUser.user.iv, 'hex');

        const decryptedDataUser = {
            name: dataUser.user.name,
            nik: encrypt.dekripsi(dataUser.user.nik, aesKey, iv),
            domisili: dataUser.user.domisili,
            alamat: encrypt.dekripsi(dataUser.user.alamat, aesKey, iv),
            nohp: encrypt.dekripsi(dataUser.user.nohp, aesKey, iv),
            statusPerkawinan: dataUser.user.statusPerkawinan,
            tempatlahir: dataUser.user.tempatlahir,
            tanggallahir: dataUser.user.tanggallahir,
            jenisKelamin: dataUser.user.jenisKelamin,
            agama: dataUser.user.agama,
            pekerjaan: dataUser.user.pekerjaan,
            iv: dataUser.user.iv,
        };

        console.log(`Data User decrypt: ${JSON.stringify(decryptedDataUser, null, 2)}`);
        console.log('--------------------------------------------------------------------------------');
        console.log('nik : ', decryptedDataUser.nik);
        console.log('alamat : ', decryptedDataUser.alamat);
        console.log('nohp : ', decryptedDataUser.nohp);

        const dataSurat = {
            nomoSurat: suratAcara.nomorSurat,
            nameAcara: suratAcara.nameAcara,
            jenisSurat: suratAcara.jenisSurat,
            isiAcara: suratAcara.isiAcara,
            tanggalMulai: suratAcara.tanggalMulai,
            tanggalSelesai: suratAcara.tanggalSelesai,
            tempatAcara: suratAcara.tempatAcara,
            RtName: suratAcara.RtName,
            RwName: suratAcara.RwName,
            user: decryptedDataUser,
            subSuratId: suratAcara.subSuratId,
            statusPersetujuan: suratAcara.statusPersetujuan,
        };

        const pdfBuffer = await generateSuratPDF(dataSurat);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${suratAcara.jenisSurat}.pdf"`,
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send({ message: error.message || "Some error occurred while generating Surat Acara." });
    }
};


exports.updateSuratPdf_TAVERSION = async (req, res) => {
    try {
        const { idSuratAcara } = req.params;
        const { nameAcara, isiAcara, tanggalMulai, tanggalSelesai, tempatAcara, } = req.body;
        const suratAcara = await suratAcaraModel.findById(idSuratAcara)
        if (!suratAcara) {
            throw new Error(`Surat Acara with id ${idSuratAcara} not found`);
        }

        if (!suratAcara.statusAcara === 'revision') {
            throw new Error(`Surat Acara with id ${idSuratAcara} is not revision status`);
        }
        if (nameAcara) {
            suratAcara.nameAcara = nameAcara;
        }
        if (isiAcara) {
            suratAcara.isiAcara = isiAcara;
        }
        if (tanggalMulai) {
            suratAcara.tanggalMulai = tanggalMulai;
        }
        if (tanggalSelesai) {
            suratAcara.tanggalSelesai = tanggalSelesai;
        }
        if (tempatAcara) {
            suratAcara.tempatAcara = tempatAcara;
        }
        await suratAcara.save();
    } catch (error) {
        return res.status(500).send({
            message: error.message || "Some error occurred while updating Surat Acara."
        });
    }
}

exports.deleteSuratAcaraById = async (req, res) => {
    const UserId = req.params.userId;
    const SuratAcaraId = req.params.suratAcaraId;

    try {
        const User = await WargaModel.findById(UserId);
        if (!User) {
            return res.status(404).send({
                message: "User not found with id " + UserId
            });
        }
        const SuratAcara = await suratAcaraModel.findById(SuratAcaraId);
        if (!SuratAcara) {
            return res.status(404).send({
                message: "Surat Acara not found with id " + SuratAcaraId
            });
        }

        if (SuratAcara.wargaId.toString() !== UserId) {
            return res.status(403).send({
                message: "Forbidden. Surat Acara does not belong to the specified user."
            });
        }

        const dataSuratAcara = await suratAcaraModel.findByIdAndDelete(SuratAcaraId);

        res.status(200).send({
            message: "Success delete surat acara",
            data: dataSuratAcara
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while delete surat acara."
        });
    }
}

//Rt
exports.persetujuanSuratAcaraRt_TAVERSION = async (req, res) => {
    try {
        const idSurat = req.params.suratAcaraId;
        const idRt = req.params.rtId;
        const { statusPersetujuanReq } = req.body;
        const PakRt = await RtModel.findById(idRt);

        if (!PakRt) {
            console.error("RT not found with id", idRt);
            return res.status(404).send({
                message: "RT not found with id " + idRt
            });
        }

        const userRt = await userModel.findById(PakRt.user);
        if (!userRt) {
            console.error("User RT not found with id", PakRt.user);
            return res.status(404).send({
                message: "User RT not found with id " + PakRt.user
            });
        }

        const suratAcara = await suratAcaraModel.findById(idSurat);
        if (!suratAcara) {
            console.error("Surat Acara not found with id", idSurat);
            return res.status(404).send({
                message: "Surat Acara not found with id " + idSurat
            });
        }

        if (suratAcara.statusPersetujuan === 'belum ada persetujuan') {
            if (statusPersetujuanReq === true) {
                suratAcara.statusPersetujuan = 'disetujui rt';
                PakRt.suratAcaraApproved.push(suratAcara._id);
                const dataIndex = PakRt.suratAcaraPending.indexOf(suratAcara._id);
                PakRt.suratAcaraPending.splice(dataIndex, 1);


                const PakRw = await RwModel.findOne({ ketuaRw: userRt.domisili[1] });
                if (!PakRw || PakRw.length === 0) {
                    console.error("RW not found with domisili rw", userRt.domisili[1]);
                    return res.status(404).send({
                        message: "RW not found with domisili rw " + userRt.domisili[1]
                    });
                }
                suratAcara.statusAcara = 'pengajuan rw';
                PakRw.suratAcaraPending.push(suratAcara._id);
                const dataIndexRw = PakRw.suratAcaraComing.indexOf(suratAcara._id);
                PakRw.suratAcaraComing.splice(dataIndexRw, 1);

                await PakRw.save();
                await PakRt.save();

            } else if (statusPersetujuanReq === false) {
                suratAcara.statusPersetujuan = 'ditolak rt';
                PakRt.suratAcaraRejected.push(suratAcara._id);
                await PakRt.save();
            }

            await suratAcara.save();
            await PakRt.save();

            res.status(200).send({
                message: "Surat Acara successfully updated with RT approval status." + statusPersetujuanReq,
                data: suratAcara
            });
        } else {
            console.error("Surat Acara has already been approved or rejected.");
            res.status(400).send({
                message: "Surat Acara has already been approved or rejected."
            });
        }

    } catch (error) {
        console.error("Error in persetujuanSuratAcara:", error);
        res.status(500).send({
            message: error.message || "Some error occurred while updating surat acara."
        });
    }
};
// RW
exports.persetujuanSuratAcaraRw_TAVERSION = async (req, res) => {
    try {
        const { SuratId, RwId } = req.params;
        const { statusPersetujuanReq } = req.body;
        const PakRw = await RwModel.findById(RwId);
        const surat = await suratAcaraModel.findById(SuratId);

        if (!PakRw) {
            return res.status(404).send({
                message: "RW not found."
            });
        }

        if (!surat) {
            return res.status(404).send({
                message: "Surat not found."
            });
        }

        if (surat.statusPersetujuan === "belum ada persetujuan" || surat.statusPersetujuan === "ditolak rt") {
            return res.status(404).send({
                message: "Belum ada persetujuan dari RT."
            });
        }

        if (surat.statusPersetujuan === "disetujui rt" && surat.statusAcara === "pengajuan rw") {
            if (statusPersetujuanReq === true) {
                surat.statusPersetujuan = "disetujui rw";
                const rolePd = kasiDecider(surat.jenisSurat);

                if (rolePd !== null) {
                    const Kasi = await PerangkatDesaModel.findOne({ rolePD: rolePd.role });

                    if (Kasi) {
                        surat.statusAcara = `pengajuan perangkat desa kasi ${getKasiType(rolePd.role)}`;

                        Kasi.suratAcaraPending.push(surat._id);
                        // menghapus surat dari suratAcaraComing
                        const indexDataKasi = Kasi.suratAcaraComing.indexOf(surat._id);
                        Kasi.suratAcaraComing.splice(indexDataKasi, 1);
                        await Kasi.save();

                        surat.rwId = RwId;
                        await surat.save();

                        PakRw.suratAcaraApproved.push(surat._id);
                        const indexData = PakRw.suratAcaraPending.indexOf(surat._id);
                        PakRw.suratAcaraPending.splice(indexData, 1);
                        await PakRw.save();

                        return res.status(200).send({
                            message: "Success update persetujuan surat",
                            info: "Surat sudah disetujui RW dan sudah diajukan ke Perangkat Desa",
                            data: surat
                        });
                    } else {
                        return res.status(404).send({
                            message: "Perangkat Desa not found."
                        });
                    }
                }
            } else {
                surat.statusPersetujuan = "ditolak rw";
                PakRw.suratAcaraRejected.push(surat._id);
                const indexData = PakRw.suratAcaraPending.indexOf(surat._id);
                PakRw.suratAcaraPending.splice(indexData, 1);
                await surat.save();
                await PakRw.save();
                return res.status(200).send({
                    message: "Success update persetujuan surat",
                    info: "Surat ditolak RW",
                    data: surat
                });
            }
        }
    } catch (error) {
        return res.status(500).send({
            message: error.message || "Some error occurred while updating persetujuan surat."
        });
    }
};

//Perangkat Desa
exports.persetujuanSuratAcaraPerangkatDesa_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { suratAcaraId, perangkatDesaId } = req.params;
        const { statusPersetujuanReq } = req.body;
        const dataPD = await PerangkatDesaModel.findById(perangkatDesaId);
        const surat = await suratAcaraModel.findById(suratAcaraId);


        if (!dataPD || !surat) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "perangkat desa or surat acara not found with id " + id
            });
        }

        if (surat.statusPersetujuan === 'belum ada persetujuan' || surat.statusPersetujuan === 'ditolak rw') {
            await session.abortTransaction();
            return res.status(404).send({
                message: "belum ada persetujuan dari rw " + id
            });
        }

        if (surat.statusPersetujuan === 'disetujui rw' && statusPersetujuanReq === true) {
            surat.statusPersetujuan = 'disetujui perangkat desa';
            surat.statusAcara = 'pengajuan kades dan wakades';

            dataPD.suratAcaraApproved.push(suratAcaraId);
            const indexData = dataPD.suratAcaraPending.indexOf(suratAcaraId);
            dataPD.suratAcaraPending.splice(indexData, 1);
            await dataPD.save();

            const DataPimpinanDesa = await PimpinanDesa.findOne({ rolePemimpinDesa: 1 });
            if (!DataPimpinanDesa) {
                return res.status(404).send({ message: "kepala desa not found" });
            }
            DataPimpinanDesa.suratAcaraPending.push(suratAcaraId);
            const indexDataPimpinanDesa = DataPimpinanDesa.suratAcaraComing.indexOf(suratAcaraId);
            DataPimpinanDesa.suratAcaraComing.splice(indexDataPimpinanDesa, 1);
            await DataPimpinanDesa.save();
            surat.perangkatDesaId = dataPD._id
            await surat.save();
            await session.commitTransaction();
            return res.send({
                message: "Success submit surat perangkat desa",
                result: surat
            });
        }
        else {
            surat.statusPersetujuan = 'ditolak perangkat desa';
            dataPD.suratAcaraRejected.push(suratAcaraId);
            const indexData = dataPD.suratAcaraPending.indexOf(suratAcaraId);
            dataPD.suratAcaraPending.splice(indexData, 1);
            await dataPD.save();
            await surat.save();
            return res.send({
                message: "Success submit surat perangkat desa", result: surat
            });
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while pelayanan konter by id."
        });
    }
};

//Kepala Desa
exports.persetujuanSuratAcaraKades_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { kadesId, suratAcaraId } = req.params;
        const { statusPersetujuanReq } = req.body;

        // Temukan data Kades berdasarkan ID
        const dataKades = await PimpinanDesa.findById(kadesId).session(session);
        if (!dataKades) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data kades not found"
            });
        }

        // Temukan data Surat Acara berdasarkan ID
        const dataSuratAcara = await suratAcaraModel.findById(suratAcaraId).session(session);
        if (!dataSuratAcara) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data surat acara not found"
            });
        }

        // Periksa apakah Surat Acara sudah disetujui
        if (dataSuratAcara.statusPersetujuan === "disetujui") {
            await session.abortTransaction();
            return res.status(400).send({
                message: "Surat acara sudah disetujui"
            });
        }

        // Inisialisasi array suratAcaraRejected jika belum terdefinisi
        if (!dataSuratAcara.suratAcaraRejected) {
            dataSuratAcara.suratAcaraRejected = [];
        }

        // Proses persetujuan atau penolakan Surat Acara
        if (statusPersetujuanReq === true && dataSuratAcara.statusAcara === "pengajuan kades dan wakades") {
            dataSuratAcara.statusPersetujuan = "disetujui pimpinan desa";
            dataSuratAcara.statusAcara = "pengajuan selesai";
            dataKades.suratAcaraApproved.push(dataSuratAcara._id);

            const indexData = dataKades.suratAcaraPending.indexOf(dataSuratAcara._id);
            if (indexData > -1) {
                dataKades.suratAcaraPending.splice(indexData, 1);
            }

            await dataKades.save();
            await dataSuratAcara.save();
            await session.commitTransaction();

            return res.status(200).send({
                message: "Success submit surat kades",
                data: dataSuratAcara
            });
        } else {
            dataSuratAcara.statusPersetujuan = "ditolak pimpinan desa";
            dataSuratAcara.suratAcaraRejected.push(dataSuratAcara._id);

            const indexData = dataKades.suratAcaraPending.indexOf(dataSuratAcara._id);
            if (indexData > -1) {
                dataKades.suratAcaraPending.splice(indexData, 1);
            }

            await dataSuratAcara.save();
            await dataKades.save();
            await session.commitTransaction();

            return res.status(200).send({
                message: "Success submit surat kades",
                data: dataSuratAcara
            });
        }
    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({
            message: error.message || "Some error occurred while submit surat kades."
        });
    } finally {
        session.endSession();
    }
};

// RT BAYPASS
exports.baypassSuratAcaraRT_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { suratAcaraId } = req.params;
        const dataSuratAcara = await suratAcaraModel.findById([suratAcaraId]).session(session);

        if (!dataSuratAcara) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data surat acara not found"
            });
        }

        const dataRt = await RtModel.findById(dataSuratAcara.rtId).session(session);
        if (!dataRt) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data RT not found"
            });
        }

        dataSuratAcara.statusPersetujuan = "disetujui RT";
        dataSuratAcara.statusAcara = "pengajuan RW";
        dataSuratAcara.keterangan.push(`Surat acara ini telah dilewati oleh ketua RT ${dataRt.ketuaRt}`);
        dataRt.suratAcaraApproved.push(dataSuratAcara._id);
        const indexData = dataRt.suratAcaraPending.indexOf(dataSuratAcara._id);
        dataRt.suratAcaraPending.splice(indexData, 1);

        const dataRw = await RwModel.findById(dataSuratAcara.rwId).session(session);
        if (!dataRw) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data RW not found"
            });
        }

        dataRw.suratAcaraPending.push(dataSuratAcara._id);
        const iDC_RW = dataRw.suratAcaraComing.indexOf(dataSuratAcara._id);
        dataRw.suratAcaraComing.splice(iDC_RW, 1);


        await dataRw.save();
        await dataRt.save();
        await dataSuratAcara.save();

        await session.commitTransaction();
        return res.status(200).send({
            message: "Success submit surat RT",
            data: dataSuratAcara
        });


    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({
            message: error.message || "Some error occurred while submit surat RT."
        });
    } finally {
        session.endSession();
    }
}
// RW BAYPASS
exports.baypassSuratAcaraRW_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { suratAcaraId } = req.params;
        const dataSuratAcara = await suratAcaraModel.findById([suratAcaraId]).session(session);

        if (!dataSuratAcara) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data surat acara not found"
            });
        }

        const dataRt = await RtModel.findById(dataSuratAcara.rtId).session(session);
        if (!dataRt) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data RT not found"
            });
        }


        const dataRw = await RwModel.findById(dataSuratAcara.rwId).session(session);

        if (!dataRw) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data RW not found"
            });
        }

        const dataPd = await PerangkatDesaModel.findById(dataSuratAcara.perangkatDesaId).session(session);

        if (!dataPd) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data Perangkat Desa not found"
            });
        }



        dataSuratAcara.statusPersetujuan = "disetujui RW";
        dataSuratAcara.statusAcara = `pengajuan perangkat desa kasi ${getKasiType(dataPd.rolePD)}`;
        dataSuratAcara.keterangan.push(`Surat acara ini telah dilewati oleh ketua RW ${dataRw.ketuaRw}`);


        dataRt.suratAcaraApproved.push(dataSuratAcara._id);
        const indexData = dataRt.suratAcaraPending.indexOf(dataSuratAcara._id);
        dataRt.suratAcaraPending.splice(indexData, 1);

        dataRw.suratAcaraApproved.push(dataSuratAcara._id);
        const iDC_RW = dataRw.suratAcaraPending.indexOf(dataSuratAcara._id);
        dataRw.suratAcaraPending.splice(iDC_RW, 1);

        dataPd.suratAcaraPending.push(dataSuratAcara._id);
        const iDC_PD = dataPd.suratAcaraComing.indexOf(dataSuratAcara._id);
        dataPd.suratAcaraComing.splice(iDC_PD, 1);

        await dataPd.save();
        await dataRw.save();
        await dataRt.save();
        await dataSuratAcara.save();


        await session.commitTransaction();
        return res.status(200).send({
            message: "Success submit surat RW",
            data: dataSuratAcara
        });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({
            message: error.message || "Some error occurred while submit surat RW."
        });
    } finally {
        session.endSession();
    }
}
// KASI BAYPASS
exports.baypassSuratAcaraKasi_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { suratAcaraId } = req.params;
        const dataSuratAcara = await suratAcaraModel.findById([suratAcaraId]).session(session);

        if (!dataSuratAcara) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data surat acara not found"
            });
        }

        const dataRt = await RtModel.findById(dataSuratAcara.rtId).session(session);
        if (!dataRt) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data RT not found"
            });
        }

        const dataRw = await RwModel.findById(dataSuratAcara.rwId).session(session);

        if (!dataRw) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data RW not found"
            });
        }

        const dataPd = await PerangkatDesaModel.findById(dataSuratAcara.perangkatDesaId).session(session);
        if (!dataPd) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data Perangkat Desa not found"
            });
        }

        const dataKades = await PimpinanDesa.findById(dataSuratAcara.pimpinanDesaId).session(session);
        if (!dataKades) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Data Kades not found"
            });
        }

        dataSuratAcara.statusPersetujuan = `disetujui perangkat desa kasi ${getKasiType(dataPd.rolePD)}`;
        dataSuratAcara.statusAcara = `pengajuan kades dan wakades`;
        dataSuratAcara.keterangan.push(`Surat acara ini telah dilewati oleh kasi ${getKasiType(dataPd.rolePD)}`);


        dataRt.suratAcaraApproved.push(dataSuratAcara._id);
        const indexData = dataRt.suratAcaraPending.indexOf(dataSuratAcara._id);
        dataRt.suratAcaraPending.splice(indexData, 1);



        dataRw.suratAcaraApproved.push(dataSuratAcara._id);
        const iDC_RW = dataRw.suratAcaraComing.indexOf(dataSuratAcara._id);
        dataRw.suratAcaraComing.splice(iDC_RW, 1);

        dataPd.suratAcaraApproved.push(dataSuratAcara._id);
        const iDC_PD = dataPd.suratAcaraComing.indexOf(dataSuratAcara._id);
        dataPd.suratAcaraComing.splice(iDC_PD, 1);

        dataKades.suratAcaraPending.push(dataSuratAcara._id);
        const iDC_Kades = dataKades.suratAcaraComing.indexOf(dataSuratAcara._id);
        dataKades.suratAcaraComing.splice(iDC_Kades, 1);

        await dataKades.save();
        await dataPd.save();
        await dataRw.save();
        await dataRt.save();
        await dataSuratAcara.save();

        await session.commitTransaction();
        return res.status(200).send({
            message: "Success submit surat RW",
            data: dataSuratAcara
        });


    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({
            message: error.message || "Some error occurred while submit surat RW."
        });
    } finally {
        session.endSession();
    }
}

//passing surat acara kades to wakades
exports.passingSuratAcara_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { suratAcaraId } = req.params;
        const keteranga = `Surat acara ini telah di pindahkan oleh Kades ke wakil kades dengan alasan : ${req.body.keteranganPassing}`;
        const suratAcara = await suratAcaraModel.findById(suratAcaraId).session(session);
        if (!suratAcara) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Surat Acara not found with id " + suratAcaraId
            });
        }

        const wakilKades = await PimpinanDesa.findOne({ rolePemimpinDesa: 2 }).session(session);
        const kades = await PimpinanDesa.findOne({ rolePemimpinDesa: 1 }).session(session);

        if (!wakilKades || !kades) {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Wakil Kades or Kades not found"
            });
        }
        const indexDataKades = kades.suratAcaraPending.indexOf(suratAcaraId);
        if (indexDataKades !== -1) {
            suratAcara.keterangan.push(keteranga);
            wakilKades.suratAcaraPending.push(suratAcara._id);
            kades.suratAcaraPending.splice(indexDataKades, 1);
            await wakilKades.save();
            await kades.save();
            await suratAcara.save();
            await session.commitTransaction();
            return res.status(200).send({
                message: "Success passing surat acara",
                data: suratAcara
            });
        } else {
            await session.abortTransaction();
            return res.status(404).send({
                message: "Surat Acara not found in Kades suratAcaraPending"
            });
        }
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).send({
            message: error.message || "Some error occurred while passing surat acara."
        });
    } finally {
        session.endSession();
    }
};

exports.suratAcaraRevisi_TAVERSION = async (req, res) => {
    const sesion = await mongoose.startSession();
    sesion.startTransaction();
    try {
        const { suratAcaraId } = req.params;
        const { newIsiAcara } = req.body;

        const dataSuratAcara = await suratAcaraModel.findById(suratAcaraId).session(sesion);
        if (!dataSuratAcara) {
            await sesion.abortTransaction();
            return res.status(404).send({
                message: "Data surat acara not found"
            });
        }
        if (dataSuratAcara.keterangan.length !== 0) {
            await sesion.abortTransaction();
            return res.status(400).send({
                message: "Surat acara tidak bisa di edit "
            });
        }

        if (dataSuratAcara.statusPersetujuan === "ditolak rt") {
            const dataRt = await RtModel.findById(dataSuratAcara.rtId).session(sesion);
            if (!dataRt) {
                await sesion.abortTransaction();
                return res.status(404).send({
                    message: "Data RT not found"
                });
            }
            dataSuratAcara.isiAcara = newIsiAcara;
            dataSuratAcara.keterangan.push(`Surat sudah di revisi oleh warga`);
            const indexData = dataRt.suratAcaraRejected.indexOf(dataSuratAcara._id);
            dataRt.suratAcaraPending.push(dataSuratAcara._id);
            dataRt.suratAcaraRejected.splice(indexData, 1);

            await dataRt.save();
            await dataSuratAcara.save();
            await sesion.commitTransaction();
            return res.status(200).send({
                message: "Success edit surat acara",
                data: dataSuratAcara
            });
        }

        if (dataSuratAcara.statusPersetujuan === "ditolak rw") {
            const dataRw = await RwModel.findById(dataSuratAcara.rwId).session(sesion);
            if (!dataRw) {
                await sesion.abortTransaction();
                return res.status(404).send({
                    message: "Data RW not found"
                });
            }
            dataSuratAcara.isiAcara = newIsiAcara;
            dataSuratAcara.keterangan.push(`Surat sudah di revisi oleh warga`);
            const indexData = dataRw.suratAcaraRejected.indexOf(dataSuratAcara._id);
            dataRw.suratAcaraPending.push(dataSuratAcara._id);
            dataRw.suratAcaraRejected.splice(indexData, 1);

            await dataRw.save();
            await dataSuratAcara.save();
            await sesion.commitTransaction();
            return res.status(200).send({
                message: "Success edit surat acara",
                data: dataSuratAcara
            });
        }

        if (dataSuratAcara.statusPersetujuan === "ditolak perangkat desa") {
            const dataPd = await PerangkatDesaModel.findById(dataSuratAcara.perangkatDesaId).session(sesion);
            if (!dataPd) {
                await sesion.abortTransaction();
                return res.status(404).send({
                    message: "Data Perangkat Desa not found"
                });
            }
            dataSuratAcara.isiAcara = newIsiAcara;
            dataSuratAcara.keterangan.push(`Surat sudah di revisi oleh warga`);
            const indexData = dataPd.suratAcaraRejected.indexOf(dataSuratAcara._id);
            dataPd.suratAcaraPending.push(dataSuratAcara._id);
            dataPd.suratAcaraRejected.splice(indexData, 1);

            await dataPd.save();
            await dataSuratAcara.save();
            return res.status(200).send({
                message: "Success edit surat acara",
                data: dataSuratAcara
            });
        }

        if (dataSuratAcara.statusPersetujuan === "ditolak kades") {
            const dataKades = await PimpinanDesa.findById(dataSuratAcara.pimpinanDesaId).session(sesion);
            if (!dataKades) {
                await sesion.abortTransaction();
                return res.status(404).send({
                    message: "Data Kades not found"
                });
            }
            dataSuratAcara.isiAcara = newIsiAcara;
            dataSuratAcara.keterangan.push(`Surat sudah di revisi oleh warga`);
            const indexData = dataKades.suratAcaraRejected.indexOf(dataSuratAcara._id);
            dataKades.suratAcaraPending.push(dataSuratAcara._id);
            dataKades.suratAcaraRejected.splice(indexData, 1);

            await dataKades.save();
            await dataSuratAcara.save();
            return res.status(200).send({
                message: "Success edit surat acara",
                data: dataSuratAcara
            });
        }

    } catch (error) {
        return res.status(500).send({
            message: error.message || "Some error occurred while update surat acara."
        });
    } finally {
        sesion.endSession();
    }
};


exports.arsipSuratAcara_TAVERSION = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { suratAcaraId, isArchive } = req.params;
        if (isArchive === 'true') {
            const dataSurat = await suratAcaraModel.findById(suratAcaraId).session(session);
            if (!dataSurat) {
                await session.abortTransaction();
                return res.status(404).send({
                    message: "Data surat acara not found"
                });
            }
            dataSurat.isArchive = true;
            await dataSurat.save();
            await session.commitTransaction();
            return res.status(200).send({
                message: "Success archive surat acara",
                data: dataSurat
            });
        } else if (isArchive === 'false') {
            const dataSurat = await suratAcaraModel.findById(suratAcaraId).session(session);
            if (!dataSurat) {
                await session.abortTransaction();
                return res.status(404).send({
                    message: "Data surat acara not found"
                });
            }
            dataSurat.isArchive = false;
            await dataSurat.save();
            await session.commitTransaction();
            return res.status(200).send({
                message: "Success unarchive surat acara",
                data: dataSurat
            });
        }


    } catch (error) {
        await session.abortTransaction();
        return res.status(500).send({
            message: error.message || "Some error occurred while archive surat acara."
        });
    };
};

module.exports = exports;
