const {getKades,postKadesWakades,updateKadesByRole,deleteKadesById,SubmitSuratKades,getAllPimpinanDesa,getPimpinanDesaById} = require('../../../controllers/administrasi_controllers/role_administration/kepalaDesaController');
const express = require('express');
const Router = express.Router();


Router.get('/get', getAllPimpinanDesa); // http://localhost:3555/api/v1/pimpinanDesa/get
Router.get('/get/', getKades); // http://localhost:3555/api/v1/pimpinanDesa/get

Router.get('/get/kades/:id',getPimpinanDesaById) // http://localhost:3555/api/v1/pimpinanDesa/get/kades/:id

Router.post('/create', postKadesWakades);
Router.put('/update/:role', updateKadesByRole);
Router.delete('/delete/:id', deleteKadesById);

module.exports = Router;
