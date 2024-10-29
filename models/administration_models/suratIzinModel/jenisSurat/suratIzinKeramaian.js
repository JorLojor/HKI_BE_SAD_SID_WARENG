const mongoose = require('mongoose');

const suratIzinKeramaian = new mongoose.Schema({
    hariAcara: { type: String, required: true },
    tanggalAcara: { type: Date, required: true },
    // 2024-08-02T00:00:00.000+00:00 2024 : tahun, 08 : bulan, 02 : tanggal T : time 00:00:00 : jam menit detik 000+00:00 : GMT 
    waktuAcara: { type: String, required: true },
    jenisAcara: { type: String, required: true },
    lokasiKegiatan: { type: String, required: true },
}, { timestamps: false });


module.exports = mongoose.model('suratIzinKeramaian', suratIzinKeramaian);
