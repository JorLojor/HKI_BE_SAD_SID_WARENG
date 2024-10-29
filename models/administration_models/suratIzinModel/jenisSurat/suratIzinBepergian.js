const mongoose = require('mongoose');

const suratIzinBepergian = new mongoose.Schema({
    alamatSekarang : { type: String, required: true },
    alamatTujuan : { type: String, required: true },
    berlakuDari: { type: Date, required: true },
    // 2024-08-02T00:00:00.000+00:00 2024 : tahun, 08 : bulan, 02 : tanggal T : time 00:00:00 : jam menit detik 000+00:00 : GMT 
    berlakuSampai: { type: Date, required: true },
}, { timestamps: false });


module.exports = mongoose.model('suratIzinBepergian', suratIzinBepergian);
