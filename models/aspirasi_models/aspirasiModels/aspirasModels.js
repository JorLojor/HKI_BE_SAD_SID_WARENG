const mongoose = require('mongoose');

const aspirasiModel = new mongoose.Schema({
    aspirasi: { type: String, required: true },
    wargaId: { type: mongoose.Schema.Types.ObjectId, ref: 'warga' },
    validatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'validator' },
    isPublish: { type: Boolean, default: true },
    siApproved: { type: Boolean, default: false ,required:false},
    isPending: { type: Boolean, default: true ,required:false},
    kategori: { type: String ,required: true},
}, {timestamps: true});

module.exports = mongoose.model('aspirasi', aspirasiModel);
