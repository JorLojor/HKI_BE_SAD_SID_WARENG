const mongoose = require('mongoose');

const agenda = new mongoose.Schema({
    title: { type: String, required: true, title: 'Title' },
    content: { type: String, required: true, title: 'Content' },
    image: { type: String, required: true, title: 'Image' },
    location : { type: String, required: true, title: 'Location' },
    date : { type: String, required: true, title: 'Date' },
}, {timestamps: true});

const agendaModel = mongoose.model('agenda',agenda);

module.exports = agendaModel;
