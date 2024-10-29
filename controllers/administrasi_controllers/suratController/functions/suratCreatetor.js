const jenisSuratModel = require('../../../../models/administration_models/suratIzinModel/jenisSurat/index_jenis_surat');
const mongoose = require('mongoose');


// nanti di pake di controller wargaCreateSurat_TAVERSION
exports.createSubSurat = async (req, res, dataSubSurat, jenisSurat) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        if(jenisSurat === 'surat keterangan usaha'){
            const newSubSurat = await jenisSuratModel.suratKeteranganUsaha.create(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log("surat keterangan usaha",newSubSurat);
            return newSubSurat;
        }

        if(jenisSurat === 'keterangan nikah'){
            const newSubSurat = new jenisSuratModel.suratKeteranganNikah(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat keterangan nikah',newSubSurat);
            return newSubSurat;
        }

        if(jenisSurat === 'bantuan sosial'){
            const newSubSurat = new jenisSuratModel.suratBantuanSosial(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat bantuan sosial',newSubSurat);
            return newSubSurat;
        }
        
        if(jenisSurat === 'surat pengantar skck'){
            const newSubSurat = new jenisSuratModel.suratSkck(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat skck',newSubSurat);
            return newSubSurat;
        }

        if(jenisSurat === 'surat kelahiran'){
            const newSubSurat = new jenisSuratModel.suratKeteranganKelahiran(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat keterangan kelahiran',newSubSurat);
            return newSubSurat;
        }

        //surat izin keramaian
        if(jenisSurat === 'surat izin keramaian'){
            const newSubSurat = new jenisSuratModel.suratIzinKeramaian(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat izin keramaian',newSubSurat);
            return newSubSurat;
        }

        if (jenisSurat === 'surat izin bepergian'){
            const newSubSurat = new jenisSuratModel.suratIzinBepergian(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat izin bepergian',newSubSurat);
            return newSubSurat;
        }
        
        if (jenisSurat === 'keterangan tidak mampu'){
            const newSubSurat = new jenisSuratModel.suratKeteranganTidakMampu(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat keterangan tidak mampu',newSubSurat);
            return newSubSurat;
        }

        if (jenisSurat === 'surat kematian'){
            const newSubSurat = new jenisSuratModel.suratKuasaAktaKematian(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat kuasa akta kematian',newSubSurat);
            return newSubSurat;
        }


        if (jenisSurat === 'pencatatan kependudukan'){
            const newSubSurat = new jenisSuratModel.suratPencatatanKependudukan(dataSubSurat);
            await newSubSurat.save({session: session});
            await session.commitTransaction();
            console.log('surat pencatatan kependudukan',newSubSurat);
            return newSubSurat;

        }


        // if (jenisSurat === ''){

        // }
        



    }catch(err){
        console.log(err);
        const error = {
            data: "error saat membuat sub surat",
            message: err.message
        }
        throw new Error(error);
    }finally{
        session.endSession();
    }
};

exports.getSubSuratById = async (req, res) => {
    try{
        const {id, jenisSurat} = req.params;

        console.log("jenis surat",jenisSurat);

        if(jenisSurat === 'surat_keterangan_usaha'){
            const subSurat = await jenisSuratModel.suratKeteranganUsaha.findById (id);
            if(!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }
            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'keterangan_nikah'){
            const subSurat = await jenisSuratModel.suratKeteranganNikah.findById(id);
            if(!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }
            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'bantuan_sosial'){
            const subSurat = await jenisSuratModel.suratBantuanSosial.findById(id);
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'surat_pengantar_skck'){
            const subSurat = await jenisSuratModel.suratSkck.findById(id);  
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'surat_kelahiran'){
            const subSurat = await jenisSuratModel.suratKeteranganKelahiran.findById(id);
            
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'surat_izin_keramaian'){
            const subSurat = await jenisSuratModel.suratIzinKeramaian.findById(id);
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'surat_izin_bepergian'){
            const subSurat = await jenisSuratModel.suratIzinBepergian.findById(id);
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'keterangan_tidak_mampu'){
            const subSurat = await jenisSuratModel.suratKeteranganTidakMampu.findById(id);
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'surat_kematian'){
            const subSurat = await jenisSuratModel.suratKuasaAktaKematian.findById(id);
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

        if(jenisSurat === 'pencatatan_kependudukan'){
            const subSurat = await jenisSuratModel.suratPencatatanKependudukan.findById(id);
            if (!subSurat){
                return res.status(404).send({
                    message: "sub surat not found with id " + id
                });
            }

            res.status(200).send({
                message: "Success get sub surat by id",
                data: subSurat
            });
        }

    }
    catch(err){
        console.log(err);
        const error = {
            data: "error saat get sub surat",
            message: err.message
        }
        throw new Error(error);
    }
}


module.exports = exports;
