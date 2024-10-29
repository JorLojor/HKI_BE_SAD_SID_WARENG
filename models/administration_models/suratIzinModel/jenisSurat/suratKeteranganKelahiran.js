const mongoose = require('mongoose');

const suratKeteranganKelahiran = new mongoose.Schema({
    nikPelapor: { type: String, required: true },
    nikAyah: { type: String, required: true },
    nikIbu: { type: String, required: true },  
    namaAnak: { type: String, required: true },
    tempatLahir: { type: String, required: true },
    tanggalLahir: { type: Date, required: true }, 
    // 2024-08-02T00:00:00.000+00:00 2024 : tahun, 08 : bulan, 02 : tanggal T : time 00:00:00 : jam menit detik 000+00:00 : GMT 
    jenisKelamin: { type: String, required: true }, // laki-laki, perempuan
    namaPelapor: { type: String, required: true },
    hubunganPelapor: { type: String, required: true }, // ayah, ibu, saudara, kakek, nenek, paman, bibi, wali


}, { timestamps: false });

module.exports = mongoose.model('suratKeteranganKelahiran', suratKeteranganKelahiran);
