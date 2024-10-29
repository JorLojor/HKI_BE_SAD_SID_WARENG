const {getInformasi,postInformasi,getInformasiById,putInformasi,deleteInformasi}=
require('../../../controllers/informasi_controllers/informasiController');
const express = require('express');
const Router = express.Router();

Router.get('/get-informasi',getInformasi);
Router.post('/post-informasi',postInformasi);
Router.get('/get-informasi/:id',getInformasiById);
Router.put('/update-informasi/:id',putInformasi);
Router.delete('/delete-informasi/:id',deleteInformasi);

module.exports = Router;
