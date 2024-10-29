const db = require('../../models');
const adminModels = db.user_DB.admin;
const WargaModel = db.administration_DB.warga;
const rtModel = db.administration_DB.rt;
const rwModel = db.administration_DB.rw;
const pdModel = db.administration_DB.PerangkatDesaModel;
const ppModel = db.administration_DB.pimpinanDesa;
const userModel = db.user_DB.user;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.LoginAdmin = async (req,res) => {
    const {name,password} = req.body;
    try{
        const dataAdmin = await adminModels.findOne({name: name});
        if (!dataAdmin) {
            throw new Error('user not found with name :  ' + name);
        }
        const comparePassword = bcrypt.compare(password, dataAdmin.password);
        if (!comparePassword) {
            return res.status(400).send({
                message: "Invalid Password!"
            });
        }
        const token = jwt.sign({id: dataAdmin._id}, process.env.LOGIN_TOKEN, {expiresIn: '1d'});
        dataAdmin.token = token;
        await dataAdmin.save();
        res.status(200).send({
            status: 'success',
            message: "Success login warga",
            data: dataAdmin
        });
    }catch(error){
        console.log('Error:', error);
        res.status(500).send({
            message: error.message || "Some error occurred while login warga."
        });
    }
};


exports.logoutAdmin = async (req, res) => {
    const {id} = req.params;
    try{
        const dataUser = await adminModels.findById(id);
        if (!dataUser) {
            return res.status(404).send({
                message: "User not found with id " + id
            });
        }

        dataUser.token = '';
        await dataUser.save();

        res.status(200).send({
            message: "Success logout admin"
        });

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while logout warga."
        });
    }
}
// CRUD OPERATIONS
// CREATE
exports.postAdmin = async (req, res) => {
    try{
        const {name, nik, nohp, username, password} = req.body;

        const newAdmin = new adminModels({
            name,
            nik,
            nohp,
            username,
            password
        });

        const admin = await newAdmin.save();

        res.status(201).send({
            message: "success create admin",
            admin
        });
    }catch(err){
        console.log(err);
        res.status(500).send({message: err.message});
    }
}
// READ
exports.getAdminById = async (req, res) => {
    try{
        const {id} = req.params;

        const admin = await adminModels.findById(id);

        res.status(200).send({
            message: "success get admin by id",
            admin
        });
    }catch(err){
        console.log(err);
        res.status(500).send({message: err.message});
    }
}
// UPDATE
exports.updateAdmin = async (req, res) => {
    try{
        const {id} = req.params;
        const updatedData = req.body;
        
        const updatedAdmin = await adminModels.findByIdAndUpdate(id, updatedData, {new: true});

        if(!updatedAdmin){
            return res.status(404).send({message: "admin not found"});
        }

        res.status(200).send({
            message: "success update admin",
            admin: updatedAdmin
        });
    }catch(err){
        console.log(err);
        res.status(500).send({message: err.message});
    }
}
// DELETE
exports.deleteAdmin = async (req, res) => {
    try{
        const {id} = req.params;

        const admin = await adminModels.findByIdAndDelete(id);

        res.status(200).send({
            message: "success delete admin",
            admin
        });
    }catch(err){
        console.log(err);
        res.status(500).send({message: err.message});
    }
}



////// WARGA //////
exports.postWarga = async (req,res) => {
    try{
        const {idUser} = req.params;

        const dataUser = await userModel.findByIdAndUpdate(idUser, {
            role: 1 // (warga)
        }, {new: true});

        const newWarga = await WargaModel.create({
            user: idUser
        });

        await dataUser.save();

        res.status(200).send({
            message: "Success create warga",
            data: newWarga
        });

    }catch(error){
        console.log(error);
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
}


////// RT //////
exports.postRt = async (req, res) => {
    try {
        const { idUser } = req.params;
        const cekWarga = await WargaModel.findOne({user: idUser});
        if (!cekWarga) {
            throw new Error("User belum terdaftar sebagai warga");
        }
        await WargaModel.findOneAndDelete({user: idUser});

        const cekRw = await rwModel.findOne({user: idUser});
        if (cekRw) {
            await rwModel.findOneAndDelete({user: idUser});
        }

        const dataUser = await userModel.findByIdAndUpdate(idUser, {
            role: 2 // (rt)
        }, { new: true });

        const newRt = await rtModel.create({
            user: idUser,
            ketuaRt: dataUser.domisili[0]
        });

        await dataUser.save();

        res.status(200).json({
            message: "Success create rt",
            data: newRt
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Some error occurred while creating warga."
        });
    }
}



////// RW //////
exports.postRw = async (req,res) => {
    try{
        const {idUser} = req.params;
        const cekWarga = await WargaModel.findOne({user: idUser});
        if (!cekWarga) {
            throw new Error("User belum terdaftar sebagai warga");
        }
        await WargaModel.findOneAndDelete({user: idUser});

        const cekRt = await rtModel.findOne({user: idUser});
        if (cekRt) {
            await rtModel.findOneAndDelete({user: idUser});
        }

        const dataUser = await userModel.findByIdAndUpdate(idUser, {
            role: 3 // (rw)
        }, {new: true});

        const newRw = await rwModel.create({
            user: idUser,
            ketuaRw:dataUser.domisili[1]
        });

        await dataUser.save();

        res.status(200).send({
            message: "Success create rw",
            data: newRw
        });

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
}

////// PERANKAT DESA //////s
exports.postPerangkatDesa = async (req,res) => {
    try{
        const {idUser} = req.params;
        const {rolePerangkatDesa} = req.body;
        const dataUser = await userModel.findByIdAndUpdate(idUser, {
            role: 4 // (perangkat desa)
        }, {new: true});

        const newPerangkatDesa = await pdModel.create({
            user: idUser,
            rolePD : rolePerangkatDesa // 1 = kasi pelayanan, 2 = kasi pemerintahan, 3 = kasi kersa
        });

        await dataUser.save();

        res.status(200).send({
            message: "Success create perangkat desa",
            data: newPerangkatDesa
        });


    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
}


////// PIMPINAN DESA //////
exports.postPimpinanDesa = async (req,res) => {
    try{
        const {idUser} = req.params;
        const {RolePemimpinDesa} = req.body;


        const cekWarga = await WargaModel.findOne({user: idUser});
        if (!cekWarga) {
            throw new Error("User belum terdaftar sebagai warga");
        }
        const cekPimpinanDesa = await ppModel.findOne({rolePemimpinDesa: RolePemimpinDesa});
        if (cekPimpinanDesa) {
            throw new Error("Pimpinan Desa sudah ada anda jangan membuat duplikat role dan melengserkan pimpinan desa yang sudah ada , anjay :)");
        }
        await WargaModel.findOneAndDelete({user: idUser});

        const dataUser = await userModel.findByIdAndUpdate(idUser, {
            role: 5, // (pimpinan desa)
            
        }, {new: true});

        const newPimpinanDesa = await ppModel.create({
            user: idUser,
            rolePemimpinDesa : RolePemimpinDesa // 1 = kepala desa
        });

        await dataUser.save();

        res.status(200).send({
            message: "Success create pimpinan desa",
            data: newPimpinanDesa
        });
    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
};


/// count All document user
exports.countAllDocument = async (req,res) => {
    try{
        const totalUser = await userModel.countDocuments();
        const totalWarga = await WargaModel.countDocuments();
        const totalRt = await rtModel.countDocuments();
        const totalRw = await rwModel.countDocuments();
        const totalPerangkatDesa = await pdModel.countDocuments();  
        const totalPimpinanDesa = await ppModel.countDocuments();

        res.status(200).send({
            message: "Success get total document",
            totalUser,
            totalWarga,
            totalRt,
            totalRw,
            totalPerangkatDesa,
            totalPimpinanDesa
        });

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
};


// count All surat acara
exports.countAllSurat = async (req,res) => {
    try{
        const totalSuratAcara = await db.suratAcara.countDocuments();
        res.status(200).send({
            message: "Success get total surat acara",
            totalSurat : totalSuratAcara
        });

    }catch(error){
        res.status(500).send({
            message: error.message || "Some error occurred while creating warga."
        });
    }
};
