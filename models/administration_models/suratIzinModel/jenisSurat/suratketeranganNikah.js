const mongoose = require('mongoose');

const suratKeteranganNikah = new mongoose.Schema({
    statusPernikahan: { type: String, required: true }, // laki-laki : perjaka, duda // perempuan : perawan, janda
    istriKe: { type: Number, required: true }, // 1, 2, 3, 4

    // data ayah
    namaAyah : { type: String, required: true },
    nikAyah : { type: String, required: true },
    tempatlahirAyah: { type: String, required: true },
    tanggallahirAyah: { type: String, required: true },
    kewargaNegaraanAyah: { type: String, required: false, default: 'WNI' },
    agamaAyah: { type: String, required: true },
    pekerjaanAyah: { type: String, required: true },
    alamatAyah: { type: String, required: true },
    // data ibu
    namaIbu : { type: String, required: true },
    nikIbu : { type: String, required: true },
    tempatlahirIbu: { type: String, required: true },
    tanggallahirIbu: { type: String, required: true },
    kewargaNegaraanIbu: { type: String, required: false, default: 'WNI' },
    agamaIbu: { type: String, required: true },
    pekerjaanIbu: { type: String, required: true },
    alamatIbu: { type: String, required: true },
},{timestamps: false});


module.exports = mongoose.model('suratKeteranganNikah', suratKeteranganNikah);
