const db = require('../../../models/index');
const WargaModel = db.administration_DB.warga;
const userModel = db.user_DB.user;
const suratAcaraModel = db.administration_DB.suratAcara;
const RtModel = db.administration_DB.rt;
const RwModel = db.administration_DB.rw;

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const puppeteer = require('puppeteer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const encrypt = require('../../../utils/encryptDecrypt');



exports.LoginWarga = async (req, res) => {
    const { name, password } = req.body;
    try {
        const dataNama = name.toUpperCase();
        const dataUser = await userModel.findOne({ name: dataNama });

        if (!dataUser) {
            return res.status(404).send({
                message: `User not found with name: ${name}`
            });
        }

        const comparePassword = await bcrypt.compare(password, dataUser.password);
        if (!comparePassword) {
            return res.status(400).send({
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: dataUser._id }, process.env.LOGIN_TOKEN, { expiresIn: '1d' });
        dataUser.token = token;
        await dataUser.save();

        res.status(200).send({
            status: 'success',
            message: "Success login warga",
            data: {
                id: dataUser._id,
                name: dataUser.name,
                token: dataUser.token
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while login warga."
        });
    }
};

exports.RegisterWarga = async (req, res) => {
    try {
        const { username, password, nohp } = req.body;

        const aesKey = crypto.scryptSync(
            process.env.encrypt_key_one, 
            process.env.encrypt_key_two,
            32
        );

        if (!username || !password || !nohp) {
            return res.status(400).send({
                message: "You must insert username, password, and nohp"
            });
        }
        const checkUsername = await userModel.findOne({
            name: username.toUpperCase()
        });

        if (checkUsername) {
            const iv = Buffer.from(checkUsername.iv, 'hex');
            if (iv.length !== 16) throw new Error("IV must be 16 bytes long.");

            const cekWarga = await WargaModel.findOne({ user: checkUsername._id });
            if (cekWarga) {
                throw new Error('User already registered as warga');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newWarga = await WargaModel.create({
                user: checkUsername._id
            });

            checkUsername.password = hashedPassword;
            checkUsername.nohp = encrypt.enkripsi(nohp, aesKey, iv).encryptedData; 
            checkUsername.role = 1;
            await checkUsername.save();

            return res.status(200).send({
                message: "Success register warga",
                user: {
                    name: checkUsername.name,
                    username: checkUsername.username,
                    role: checkUsername.role
                },
                warga: newWarga,
                status: 'success'
            });
        } else {
            throw new Error('User not found with name: ' + username);
        }
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while registering warga."
        });
    }
};


exports.LogOutWarga = async (req,res) => {
    try{
        const {id} = req.params;
        const dataUser = await userModel.findById(id);
        if (!dataUser) {
            return res.status(404).send({
                message: "User not found with id " + id
            });
        }

        dataUser.token = '';
        await dataUser.save();

        res.status(200).send({
            message: "Success logout warga",
            data: dataUser
        });

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while logout warga."
        });
    }
}



// forgot password warga
exports.ForgotPassword = async (req, res) => {
    try {
        const { nik, newPassword } = req.body;

        const dataWarga = await userModel.findOneAndUpdate({ nik: nik });
        if (!dataWarga) {
            return res.status(404).send({
                status: 'failed',
                message: "Warga not found with nik " + nik
            });
        }

        dataWarga.password = await bcrypt.hash(newPassword, 10);
        await dataWarga.save();

        return res.status(200).send({
            status: 'success',
            message: "Success forgot password warga",
            data: dataWarga
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({
            message: "Internal server error. Please try again later."
        });
    }
};

exports.postWarga = async (req,res) => {
    try{
        const {id} = req.params;

        const data = await userModel.findById(id);
        if (!data) {
            return res.status(404).send({
                message: "User not found with id " + id
            });
        }

        const newWarga = await WargaModel.create({
            user: id
        });

        res.status(200).send({
            message: "Success create warga",

            
            // delete when deploy   
            data: newWarga
        });
       
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
};

exports.updateWargaById = async (req,res) => {
    try{
        const id = req.params.id;
        const {updatedData} = req.body;

        const updatedWarga = await WargaModel.findByIdAndUpdate(id, updatedData, {new: true});
        if (!updatedWarga) {
            return res.status(404).send({
                message: "warga not found with id " + id
            });
        }

        updatedWarga.save();

        res.status(200).send({
            message: "Success update warga",
            data: updatedWarga
        });
        
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while update warga."
        });
    }
}



exports.getAllWarga = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Menambahkan nilai default jika query parameter tidak ada
        const limitt = parseInt(req.query.limit) || 10; // Menambahkan nilai default jika query parameter tidak ada
        
        const warga = await WargaModel.find()
            .populate('user')
            .populate('suratAcara')
            .limit(limitt)
            .skip((page - 1) * limitt);

        const total = await WargaModel.countDocuments();

        res.status(200).send({
            message: "Success get all warga",
            data: warga,
            page: page,
            limit: limitt,
            totalDocument: total
        });

    } catch (err) {
        console.error('Error while handling GET request to /api/v1/warga/get:', err);
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving warga."
        });
    }
};


// this controller used for user not admin

exports.getAllwargaLessDetail = async (req, res) => {
    try {
        const viewerId = req.params.id;
        const ArrData = [];
        const validViewer = await userModel.findById(viewerId);

        // validasi user memiliki token sesuai login
        const token = req.header('Authorization');
        if (!token || !validViewer || validViewer.token !== token.replace('Bearer ', '')) {
            return res.status(403).send({
                message: "Forbidden. You are not authorized to access this resource."
            });
        }

        const warga = await WargaModel.find().populate('user');
        warga.forEach((warga) => {
            if (warga.user && warga.user.name && warga.user.alamat) {
                const dataResponse = {
                    nama: warga.user.name,
                    alamat: warga.user.alamat
                };
                ArrData.push(dataResponse);
            }
        });

        const dataRequest = validViewer.name;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const total = ArrData.length;

        res.status(200).send({
            request: "GET",
            from: dataRequest,
            message: "Success get all warga less detail for users",
            data: ArrData,
            page: page,
            limit: limit,
            totalDocument: total
        });

    } catch (error) {
        console.error('Error while handling GET request to /api/v1/warga/get:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while getting all warga less detail."
        });
    }
}



exports.getWargaByIdUser = async (req,res) => {
    const id = req.params.id;
    try{

        // mencari warga dengan id dari user 
        const warga = await WargaModel.findOne({user: id}).populate('suratAcara');
        if (!warga) {
            return res.status(404).send({
                message: "warga not found with id " + id
            });
        }

        res.status(200).send({
            message: "Success get warga by id",
            data: warga
        });
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while get warga by id."
        });
    }
}
        


exports.deleteWargaById = async (req,res) => {
    const id = req.params.id;
    try{
        // ambil id user dari warga
        const dataUser = await WargaModel.findById(id);
        const idUser = dataUser.user;
        // hapus user
        const user = await userModel.findByIdAndDelete(idUser);
        if (!user) {
            return res.status(404).send({
                message: "user not found with id " + idUser
            });
        }
        // hapus warga
        const warga = await WargaModel.findByIdAndDelete(id);
        if (!warga) {
            return res.status(404).send({
                message: "warga not found with id " + id
            });
        }

        res.status(200).send({
            message: "Success delete warga by id",
            data: warga
        });

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while delete warga by id."
        });
    }
}

// udh nga kepake
exports.CreateSuratAcara = async (req, res) => {
    try {
        const wargaId = req.params.id;

        // Temukan user berdasarkan id
        const user = await userModel.findById(wargaId);

        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + wargaId
            });
        }

        // Temukan warga berdasarkan user id
        const warga = await WargaModel.findOne({ user: wargaId });

        if (!warga) {
            return res.status(404).send({
                message: "Warga not found with user id " + wargaId
            });
        }

        const { nameAcara, jenisSurat, isiAcara, tanggalMulai, tanggalSelesai, tempatAcara } = req.body;

        // Periksa apakah surat acara dengan nama yang sama sudah ada
        const existingSuratAcara = await suratAcaraModel.findOne({
            nameAcara,
            wargaId: warga._id
        });

        if (existingSuratAcara) {
            return res.status(400).send({
                message: "Surat Acara already exists with name " + nameAcara + " for user with id " + wargaId,
            });
        }

        // Buat surat acara baru
        const suratAcara = await suratAcaraModel.create({
            nameAcara,
            jenisSurat: jenisSurat.toLowerCase(),
            isiAcara,
            tanggalMulai,
            tanggalSelesai,
            tempatAcara,
            wargaId: warga._id
        });

        // Tambahkan ID surat acara ke array suratAcara di warga
        warga.suratAcara.push(suratAcara._id);
        await warga.save();

        res.status(200).send({
            message: "Success create surat acara",
            data: suratAcara,
            author: warga
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while create surat acara."
        });
    }
};




exports.pengajuanSuratAcara = async (req, res) => {
    try {
        const userId = req.params.userId;
        const suratAcaraId = req.params.suratAcaraId;

        // mencari user dengan id userId
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send({
                message: "User not found with id = " + userId
            });
        }

        // mencari warga dengan user userId
        const warga = await WargaModel.findOne({ user: userId });
        if (!warga){
            return res.status(404).send({
                message: "Warga not found with id " + userId
            });
        }
        //mencari rt dengan field rt yang sama dengan domisili warga index ke 0
        const Rt = await RtModel.find({ ketuaRt: user.domisili[0] });
        if (!Rt || Rt.length === 0) {
            return res.status(404).send({
                message: "RT not found with domisili rt " + user.domisili[0]
            });
        }


        const suratAcara = await suratAcaraModel.findById(suratAcaraId);
        if (!suratAcara) {
            return res.status(404).send({
                message: "Surat Acara not found with id " + suratAcaraId
            });
        }

        // mengecek apakah surat acara sudah ada di dalam array suratAcaraPending
        const checkSuratAcara = Rt[0].suratAcaraPending.find((suratAcaraPending) => suratAcaraPending.toString() === suratAcaraId);
        if (checkSuratAcara) {
            return res.status(400).send({
                message: "Surat Acara already in pending",
                data: checkSuratAcara
            });
        }

        // memasukan surat acara ke dalam array yang berada di Rt.suratAcaraPending
        Rt[0].suratAcaraPending.push(suratAcara._id);
        await Rt[0].save();

        if (suratAcara.wargaId.toString() !== warga._id.toString()) {
            return res.status(403).send({
                message: "Forbidden. Surat Acara does not belong to the specified user."
            });
        }

        suratAcara.statusAcara = 'pengajuan';
        await suratAcara.save();

        res.status(200).send({
            message: "Surat Acara berhasil diajukan.",
            suratAcara: suratAcara
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while creating Surat Acara."
        });
    }
};

module.exports = exports;
