const db = require('../../models');
const kegiatanModel = require('../../models/informasi_models/informasiModels/kegiatanModel');
const { uploadProjectImages } = require('../../middlewares/imageUpload');
const response = require('../../response/response');


exports.getFilter = async (req, res) => {
    try {
        const { title, date, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);
            searchQuery.date = { $gte: searchDate, $lt: nextDay };
        }

        const skip = (page - 1) * limit;
        const content = await kegiatanModel.find(filter).skip(skip).limit(parseInt(limit));
        const totalItems = await kegiatanModel.countDocuments(filter);
        return response(200, res, {
            data: content,
            currentPage: parseInt(page),
            totalItems: totalItems,
            itemsPerPage: parseInt(limit),
            totalPages: Math.ceil(totalItems / limit)
        }, 'Success get kegiatan');
    } catch (err) {
        return response(500, res, 'error', err.message || 'Some error occurred while getting kegiatan.');
    }
},


    exports.getKegiatan = async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        try {
            const content = await kegiatanModel.find()
                .sort({ date: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const totalItems = await kegiatanModel.countDocuments();
            const totalPages = Math.ceil(totalItems / limit);

            return response(200, res, {
                data: content,
                currentPage: parseInt(page),
                totalPages: totalPages,
                totalItems: totalItems,
                itemsPerPage: parseInt(limit)
            }, 'Success get kegiatan');
        } catch (err) {
            return response(500, res, 'error', err.message || 'Some error occurred while getting kegiatan.');
        }
    };



exports.getKegiatanById = async (req, res) => {
    try {
        const id = req.params.id;
        const content = await kegiatanModel.findById(id);
        return response(200, res, content, 'Success get kegiatan');
    } catch (err) {
        return response(500, res, 'error', err.message || 'Some error occurred while get informasi.');
    }
}

exports.postKegiatan = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error);
            console.error(error.message);
            return response(500, res, 'error', error.message || 'Internal Server Error');
        }

        try {
            const { title, content, date, location } = req.body;
            const imgs = req.files.map((file) => file.filename);
            const newKegiatan = new kegiatanModel({
                title,
                content,
                date,
                location,
                img: imgs,
            });

            const savedKegiatan = await newKegiatan.save();

            return response(200, res, savedKegiatan, 'Success post kegiatan');

        } catch (error) {
            console.error(error.message);
            return response(500, res, 'error', err.message || 'Some error occurred while post informasi.');
        }
    });
}

exports.putKegiatan = async (req, res) => {
    uploadProjectImages(req, res, async (error) => {
        if (error) {
            console.error(error.message);
            return response(500, res, 'error', error.message || 'Internal Server Error');
            return;
        }

        try {
            const { id } = req.params;
            const { title, content, date, location, img } = req.body;

            let updateFields = { title, content, date, location, img };

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

            const updatedKegiatan = await kegiatanModel.findByIdAndUpdate(id, updateFields, { new: true });

            if (!updatedKegiatan) {
                return res.status(404).send({ message: "Kegiatan not found" });
            }

            return response(200, res, updatedKegiatan, 'Success put kegiatan');

        } catch (error) {
            return response(500, res, 'error', error.message || 'Some error occurred while put kegiatan.');
        }
    });
};



exports.deleteKegiatan = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await kegiatanModel.findByIdAndDelete(id);
        return response(200, res, savedKegiatan, 'Success delete kegiatan');
    } catch (error) {
        return response(500, res, 'error', error.message || 'Some error occurred while delete informasi.');
    }
}

