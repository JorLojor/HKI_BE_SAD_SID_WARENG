const db = require('../../models');
const portalModel = require('../../models/informasi_models/informasiModels/portalModel');
const { uploadProjectImages } = require('../../middlewares/imageUpload');
const response = require('../../response/response');


exports.getPortal = async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default page is 1 and limit is 10
    try {
        const content = await portalModel.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalItems = await portalModel.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        response(200, res, {
            data: content,
            currentPage: parseInt(page),
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: parseInt(limit)
        }, 'Success get portal');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while getting portal.');
    }
};


exports.getPortalById = async (req, res) => {
    try {
        const id = req.params.id;
        const content = await portalModel.findById(id);
        response(200, res, content, 'Success get portal');
    } catch (err) {
        response(500, res, 'error', err.message || 'Some error occurred while get informasi.');
    }
}

exports.postPortal = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error);
            console.error(error.message);
            response(500, res, 'error', error.message || 'Internal Server Error');
            return;
        }

        try {
            const { title, content, isi } = req.body;
            const imgs = req.files.map((file) => file.filename);
            const newPortal = new portalModel({
                title,
                content,
                isi,
                img: imgs,
            });

            const savedPortal = await newPortal.save();

            response(200, res, savedPortal, 'Success post portal');

        } catch (error) {
            console.error(error.message);
            response(500, res, 'error', error.message || 'Some error occurred while post informasi.');
        }
    });
}

exports.putPortal = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error.message);
            response(500, res, 'error', err.message || 'Internal Server Error');
            return;
        }

        try {
            const { id } = req.params;
            const { title, content, isi, img } = req.body;

            let updateFields = { title, content, isi, img };

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => file.filename);
                updateFields.img = newImages;
            }else{
                updateFields.img = img;
            }

            const updatedPortal = await portalModel.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedPortal) {
                return res.status(404).send({ message: "Portal not found" });
            }

            response(200, res, updatedPortal, 'Success put portal');

        } catch (error) {
            response(500, res, 'error', error.message || 'Some error occurred while put informasi.');
        }
    });
}

exports.deletePortal = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await portalModel.findByIdAndDelete(id);
        response(200, res, result, 'Success delete portal');
    } catch (error) {
        response(500, res, 'error', error.message || 'Some error occurred while delete informasi.');
    }
}

