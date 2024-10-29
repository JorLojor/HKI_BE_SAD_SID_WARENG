const mongoose = require('mongoose');

const suratKuasaAktaKematian = new mongoose.Schema({
    // penerimaKuasa :
    namaPenerimaKuasa: { type: String, required: true },
    nikPenerimaKuasa: { type: String, required: true },
    tempatLahirPenerimaKuasa: { type: String, required: true },
    tanggalLahirPenerimaKuasa: { type: Date, required: true },   
    // 2024-08-02T00:00:00.000+00:00 2024 : tahun, 08 : bulan, 02 : tanggal T : time 00:00:00 : jam menit detik 000+00:00 : GMT 
    jenisKelaminPenerimaKuasa: { type: String, required: true }, // laki-laki, perempuan
    agamaPenerimaKuasa: { type: String, required: true },
    pekerjaanPenerimaKuasa: { type: String, required: true },
    alamatPenerimaKuasa: { type: String, required: true },

    // data almarhum/ah :
    namaAlmarhum: { type: String, required: true },
    nikAlmarhum: { type: String, required: true },
}, { timestamps: false });


module.exports = mongoose.model('suratKuasaAktaKematian', suratKuasaAktaKematian);
