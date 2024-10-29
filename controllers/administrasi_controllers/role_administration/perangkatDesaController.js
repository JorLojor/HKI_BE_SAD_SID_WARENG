const db = require('../../../models/index');
const perangkatDesa = db.administration_DB.PerangkatDesaModel
const SuratAcaraModel = db.administration_DB.suratAcara;
const PimpinanDesaModel = db.administration_DB.pimpinanDesa;
const WargaModel = db.administration_DB.warga;
const decrypt = require('../../../utils/encryptDecrypt');
const crypto = require('crypto');


exports.getAllPerangkatDesa = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {


        const aesKey = crypto.scryptSync(process.env.encrypt_key_one, process.env.encrypt_key_two, 32);
        const perangkatDesaList = await perangkatDesa.find()
            .limit(limit)
            .skip((page - 1) * limit)
            .populate('user');

        perangkatDesaList.forEach(perangkat => {
            try {
                const iv = Buffer.from(perangkat.user.iv, 'hex');
                perangkat.user.nohp = decrypt.dekripsi(perangkat.user.nohp, aesKey, iv);
                perangkat.user.alamat = decrypt.dekripsi(perangkat.user.alamat, aesKey, iv);
                perangkat.user.nik = decrypt.dekripsi(perangkat.user.nik, aesKey, iv);
            } catch (error) {
                console.error(`Error decrypting data for user ${perangkat.user._id}:`, error);
            }
        });

        const total = await perangkatDesa.countDocuments();
        res.status(200).send({
            message: "Success get all konter",
            data: perangkatDesaList,
            page: page,
            limit: limit,
            totalDocument: total
        });

    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving konter."
        });
    }
};
exports.postPerangkatDesa = async (req, res) => {
    const { name, nik, password, alamat, nohp, status, role } = req.body;
    try {
        const newPerangkatDesa = await perangkatDesa.create({
            name,
            nik,
            password,
            alamat,
            nohp,
            status,
            role
        });

        res.status(200).send({
            message: "Success create konter",
            data: newPerangkatDesa
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while post konter."
        });
    }
};

exports.getPerangkatDesaById = async (req, res) => {
    const id = req.params.id;
    try {
        const dataPerangkatDesa = await perangkatDesa.findOne({ 'user': id }).populate('suratAcaraComing').populate('suratAcaraPending').populate('suratAcaraApproved').populate('suratAcaraRejected');
        if (!dataPerangkatDesa) {
            return res.status(404).send({
                message: "perangkat desa not found with id " + id
            });
        }

        res.status(200).send({
            message: "Success get perangkat desa by id",
            data: dataPerangkatDesa
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while get konter by id."
        });
    }
};

exports.updatePerangkatDesaById = async (req, res) => {
    const id = req.params.id;
    const { name, description, tags } = req.body;
    try {
        const konter = await perangkatDesa.findByIdAndUpdate(
            id,
            { name, description, tags },
            { new: true }
        );
        if (!konter) {
            return res.status(404).send({
                message: "konter not found with id " + id,
            });
        }

        res.status(200).send({
            message: "Success update konter by id",
            data: konter,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while updating konter by id.",
        });
    }
};
exports.deletePerangkatDesaById = async (req, res) => {
    const id = req.params.id;
    try {
        const konter = await perangkatDesa.findByIdAndRemove(id);
        if (!konter) {
            return res.status(404).send({
                message: "konter not found with id " + id
            });
        }

        res.status(200).send({
            message: "Success delete konter by id",
            data: konter
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while delete konter by id."
        });
    }
}

//merubah statusPersetujuan pada suratAcara menjadi disetujui perangkat desa
