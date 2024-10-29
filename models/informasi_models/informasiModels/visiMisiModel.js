const mongoose = require('mongoose');

const visiMisi = new mongoose.Schema({
    visi: { type: String, required: true, title: 'Visi' },
    misi: { type: String, required: true, title: 'Misi' },
}, {timestamps: true});

module.exports = mongoose.model('visiMisi',visiMisi);
