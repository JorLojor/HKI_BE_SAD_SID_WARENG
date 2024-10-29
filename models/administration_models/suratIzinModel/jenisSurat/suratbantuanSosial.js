const mongoose = require('mongoose');

const suratBantuanSosial = new mongoose.Schema({
    keperluan: { type: String, required: true },
    keteranganLainnya: { type: [String], required: false },
},{timestamps: false});

module.exports = mongoose.model('suratBantuanSosial', suratBantuanSosial);
