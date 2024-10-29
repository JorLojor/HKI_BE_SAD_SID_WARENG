const {getKegiatanWithSearch,getKegiatan,postKegiatan,getKegiatanById,putKegiatan,deleteKegiatan, getFilter}=
require('../../../controllers/informasi_controllers/kegiatanController');
const express = require('express');
const Router = express.Router();

Router.get('/get-kegiatan/filter',getFilter);
Router.get('/get-kegiatan',getKegiatan);
Router.post('/post-kegiatan',postKegiatan);
Router.get('/get-kegiatan/:id',getKegiatanById);
Router.put('/update-kegiatan/:id',putKegiatan);
Router.delete('/delete-kegiatan/:id',deleteKegiatan);

module.exports = Router;