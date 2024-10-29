const mongoose = require('mongoose');

const kepalaDesa = new mongoose.Schema({
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'user' },

    rolePemimpinDesa : { type: Number, required: true }, // 1 = kepala desa ,2 = wakil kepala desa
    suratAcara: [{ type: mongoose.Schema.Types.ObjectId, ref: 'suratAcara' }],
    suratAcaraComing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'suratAcara' }],
    suratAcaraPending: [{ type: mongoose.Schema.Types.ObjectId, ref: 'suratAcara' }],
    suratAcaraApproved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'suratAcara' }],
    suratAcaraRejected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'suratAcara' }],

    aspirasi: [{ type: mongoose.Schema.Types.ObjectId, ref: 'aspirasi' }],
},{timestamp: true});

const kepalaDesaModel = mongoose.model('kepalaDesa', kepalaDesa);   

module.exports = kepalaDesaModel;
