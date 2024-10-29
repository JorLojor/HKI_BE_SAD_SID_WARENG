const mongoose = require('mongoose');

const suratSkck = new mongoose.Schema({
    keperluan: { type: String, required: true },
    keteranganLainnya: { type: [String], required: false },
}, { timestamps: false });

module.exports = mongoose.model('suratSkck', suratSkck);
