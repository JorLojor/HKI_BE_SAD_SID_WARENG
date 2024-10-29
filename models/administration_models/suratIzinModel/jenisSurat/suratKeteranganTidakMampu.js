const mongoose = require('mongoose');


const suratKeteranganTidakMampu = new mongoose.Schema({
    pekerjaaan: { type: String, required: true },
    penghasilan: { type: String, required: true },
    keteranganLainnya: { type: [String], required: false },
}, { timestamps: false });

module.exports = mongoose.model('suratKeteranganTidakMampu', suratKeteranganTidakMampu);
