const db = require('../../models');
const visiMisiModels = require('../../models/informasi_models/informasiModels/visiMisiModel');
const response = require('../../response/response');

exports.getVisiMisi = async (req, res) => {
    try {
        const content = await visiMisiModels.find();
        response(200, res, content, 'Success get visi misi');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while get visi misi.');
    }
}

exports.getVisiMisiById = async (req, res) => {
    id = req.params.id
    try {
        const content = await visiMisiModels.findOne({ _id: id });
        response(200, res, content, 'Success get visi misi');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while get visi misi.');
    }
}

exports.postVisiMisi = async (req, res) => {
    try {
        const { visi, misi } = req.body;

        const newVisiMisi = new visiMisiModels({
            visi,
            misi
        });

        await newVisiMisi.save();
        response(200, res, content, 'Success post visi misi');

    } catch (error) {
        console.log("error", error.message);
        response(500, res, 'error', err.message || 'Some error occurred while post visi misi.');
    }
}


exports.putVisiMisi = async (req, res) => {
    const id = req.params.id;

    try {
        const { visi, misi } = req.body;
        let update = { visi, misi };

        const updatedVisiMisi = await visiMisiModels.findByIdAndUpdate(id, update, { new: true });
        response(200, res, content, 'Success put visi misi');

    } catch (error) {
        response(500, res, 'error', err.message || 'Some error occurred while put visi misi.');
    }
}
exports.deleteVisiMisi = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await visiMisiModels.findByIdAndDelete(id);
        response(200, res, content, 'Success delete visi misi');

    } catch (error) {
        response(500, res, 'error', err.message || 'Some error occurred while delete visi misi.');
    }
}

