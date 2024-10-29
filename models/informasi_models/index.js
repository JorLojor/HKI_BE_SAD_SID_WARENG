//import models
const agenda = require('./informasiModels/agendaModel')
const informasi = require('./informasiModels/informasiModel')
const kegiatan = require('./informasiModels/kegiatanModel')
const visiMisi = require('./informasiModels/visiMisiModel')

//db object
const db = {
    agenda,
    informasi,
    kegiatan,
    visiMisi,
}


module.exports = db;
