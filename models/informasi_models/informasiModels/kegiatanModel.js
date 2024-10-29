const mongoose = require('mongoose');

const kegiatan = new mongoose.Schema({
    title: { type: String, required: true, title: 'Title' },
    content: { type: String, required: true, title: 'Content' },
    img: [{ type: String, required: true, title: 'Image' }],
    date: { type: Date, required: true, title: 'Date' },
    location: { type: String, required: true, title: 'Location' },
}, { timestamps: true });


module.exports = mongoose.model('kegiatan',kegiatan);
