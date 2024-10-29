const mongoose = require('mongoose');

const suratPencatatanKependudukan = new mongoose.Schema({
    saksiSatu: { type: String, required: true },
    saksiDua: { type: String, required: true },
    keretangan: { type: [String], required: true },
}, { timestamps: false });

module.exports = mongoose.model('suratPencatatanKependudukan', suratPencatatanKependudukan);
