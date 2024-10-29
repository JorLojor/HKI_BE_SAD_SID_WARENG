// PACKAGES
const express = require('express');

// ROUTER

// ENDPOINT
const Router = express.Router();
Router.get('/', (req, res) => {
    res.send('API is running.....');
});

const visiMisiApi = require('./informasiApi/visiMisiApi');
Router.use('/visi-misi', visiMisiApi);

const kegiatanApi = require('./informasiApi/kegiatanApi');
Router.use('/kegiatan', kegiatanApi);

const informasiApi = require('./informasiApi/informasiApi');
Router.use('/informasi', informasiApi);

const portalApi = require('./informasiApi/portalApi');
Router.use('/portal', portalApi);

module.exports = Router;



//http://localhost:3555/ 



