const mongoose = require('mongoose');

const warga = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    suratAcara: [{ type: mongoose.Schema.Types.ObjectId, ref: 'suratAcara' }],
},{timestamps: true});

const wargaModel = mongoose.model('warga', warga);

module.exports = wargaModel;
