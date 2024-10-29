const express = require('express');
const Router = express.Router();
    
const wargaApi = require('./roleApi/wargaApi');
Router.use('/warga', wargaApi);

const suratApi = require('./suratApi/suratApi')
Router.use('/surat', suratApi);

const RtApi = require('./roleApi/RtApi');
Router.use('/rt', RtApi);

const RwApi = require('./roleApi/RwApi');
Router.use('/rw', RwApi);

const perangkatDesaApi = require('./roleApi/perangkatDesaApi');
Router.use('/perangkatDesa', perangkatDesaApi);


const pimpinanDesaApi = require('./roleApi/pimpinanDesaAPI');
Router.use('/pimpinanDesa', pimpinanDesaApi);



module.exports = Router;



//http://localhost:3555/ 
