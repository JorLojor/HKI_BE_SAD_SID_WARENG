const {getVisiMisi,postVisiMisi,getVisiMisiById,putVisiMisi,deleteVisiMisi}=
require('../../../controllers/informasi_controllers/visiMisiController');
const express = require('express');
const Router = express.Router();

Router.get('/get-visi-misi',getVisiMisi);
Router.post('/post-visi-misi',postVisiMisi);
Router.get('/get-visi-misi/:id',getVisiMisiById);
Router.put('/update-visi-misi/:id',putVisiMisi);
Router.delete('/delete-visi-misi/:id',deleteVisiMisi);

module.exports = Router;