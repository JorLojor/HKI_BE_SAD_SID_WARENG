//import models
const warga = require('./roleModels/warga/wargaModel');
const suratAcara = require('./suratIzinModel/suratAcaraModels');
const PerangkatDesaModel = require('./roleModels/perangkatDesa/PerangkatDesaModel')                                                                                  
const rt = require('./roleModels/rt/rtModels')
const rw = require('./roleModels/rw/rwModels')
const pimpinanDesa = require('./roleModels/pimpinanDesa/pimpinanDesaModels')
const jenisSurat = require('./suratIzinModel/jenisSurat/index_jenis_surat');

//db object
const db = {
    pimpinanDesa,
    rw,
    rt,
    warga,
    suratAcara,
    PerangkatDesaModel,
    jenisSurat
}

module.exports = db;
