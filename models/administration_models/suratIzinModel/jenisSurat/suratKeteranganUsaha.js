const mongoose = require('mongoose');

const suratKeteranganUsaha = new mongoose.Schema({
    usahaPokok: { type: String, required: true },
    usahaSampingan : { type: String, required: false },
    lokasiUsaha: { type: String, required: true },
},{timestamps: false});


module.exports = mongoose.model('suratKeteranganUsaha', suratKeteranganUsaha);
