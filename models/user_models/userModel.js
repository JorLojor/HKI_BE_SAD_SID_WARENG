const mongoose = require('mongoose');

const user = new mongoose.Schema({
    img: [{ type: String, required: false, title: 'Image' }],
    name: { type: String, required: true },
    nik: { type: String, required: false, default: '' },
    password: { type: String, required: false, default: '' },
    profileImage: { type: String, required: false, default: '' }, // path image
    alamat: { type: String, required: false, default: '' },
    domisili: [{ type: String, required: false, default: '' }],  // array of string[rt,rw,desa,kecamatan,kabupaten,provinsi]
    nohp: { type: String, required: true, default: '' },
    statusPerkawinan: { type: String, required: false, default: '' }, // sudah menikah atau belum ,janda ,duda, meninggal
    tempatlahir: { type: String, required: false, default: '' },
    tanggallahir: { type: String, required: false, default: '' },
    jenisKelamin: { type: String, required: false, default: '' }, // laki-laki atau perempuan
    agama: { type: String, required: false, default: '' },
    pekerjaan: { type: String, required: false, default: '' },
    kewarganegaraan: { type: String, required: false, default: 'WNI' },
    berlakuHingga: { type: String, required: false, default: 'SEUMUR HIDUP' },
    token: { type: String, required: false, default: '' },
    // domisili array of string[rt,rw,desa,kecamatan,kabupaten,provinsi]
    role: { type: Number, required: false }, // 1 = warga, 2 = rt , 3 = rw, 4 = perangkat desa, 5 = pimpinan desa
    iv: { type: String, required: false, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('user', user);
