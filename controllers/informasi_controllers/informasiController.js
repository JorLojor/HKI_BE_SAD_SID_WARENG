const db = require('../../models');
const informasiModel = require('../../models/informasi_models/informasiModels/informasiModel');
const { uploadProjectImages } = require('../../middlewares/imageUpload');
const response = require('../../response/response');

exports.getInformasi = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10
    try {
        const content = await informasiModel.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalItems = await informasiModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        response(200, res, {
            data: content,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: parseInt(limit)
        }, 'Success get informasi');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while getting informasi.');
    }
};
exports.getInformasiById = async (req, res) => {
    id = req.params.id
    try {
        const content = await informasiModel.findOne({ _id: id });
        response(200, res, content, 'Success get informasi');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while get informasi.');
    }
}

exports.postInformasi = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error);
            console.error(error.message);
            response(500, res, 'error', error.message || 'Internal Server Error');
            return;
        }

        try {
            const { title, content } = req.body;
            const imgs = req.files.map((file) => file.filename);
            const newInformasi = new informasiModel({
                title,
                content,
                img: imgs,
            });
            console.log(newInformasi);

            const savedInformasi = await newInformasi.save();

            response(200, res, savedInformasi, 'Success post informasi');

        } catch (error) {
            console.error(error.message);
            response(500, res, 'error', err.message || 'Some error occurred while post informasi.');

        }
    });
}


exports.putInformasi = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error.message);
            response(500, res, 'error', error.message || 'Internal Server Error');
            return;
        }

        try {
            const { id } = req.params;
            const { title, content, img } = req.body;
            let updateFields = { title, content, img };

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => file.filename);
                if (img && Array.isArray(img)) {
                    updateFields.img = img.concat(newImages);
                } else {
                    updateFields.img = newImages;
                }
            } else {
                updateFields.img = img;
            }

            const updatedInformasi = await informasiModel.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedInformasi) {
                return res.status(404).send({ message: "Informasi not found" });
            }

            response(200, res, updatedInformasi, 'Success put informasi');

        } catch (error) {
            console.error(error.message);
            response(500, res, 'error', err.message || 'Some error occurred while put informasi.');
        }
    });
}

exports.deleteInformasi = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await informasiModel.findByIdAndDelete(id);
        response(200, res, result, 'Success delete informasi');

    } catch (error) {
        response(500, res, 'error', err.message || 'Some error occurred while delete informasi.');
    }
}

