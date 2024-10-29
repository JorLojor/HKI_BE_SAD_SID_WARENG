const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    name: { type: String, required: true },
    nik: { type:Number, required: true, default: '',unique: true},
    nohp: { type:Number, required: true, default: ''},
    password: { type:String, required: true, default: ''},
    token: { type: String, required: false, default: '' },
},{timestamp: true});

module.exports = mongoose.model('admin', admin);
