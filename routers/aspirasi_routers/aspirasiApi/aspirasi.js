const {getAspirasiAll,postAspirasi,getAspirasiByWarga,getAspirasiById,deleteAspirasi,getAspirasiKadesAF,getAspirasiKadesAT,getAspirasiAdmin,getAspirasiApproved,putAspirasi}=require('../../../controllers/aspirasi_controller/aspirasiController');
const express = require('express');
const Router = express.Router();

Router.post('/postAspirasi/:wargaId', postAspirasi);
Router.get('/getAspirasi', getAspirasiAll);
Router.get('/getAspirasi/my/:id', getAspirasiByWarga);
Router.delete('/deleteAspirasi/:aspirasiId', deleteAspirasi);
Router.put('/updateAspirasi/:aspirasiId', putAspirasi);


Router.get('/getAspirasiKades/AT', getAspirasiKadesAT); // AT = isArchived True
Router.get('/getAspirasiKades/AF', getAspirasiKadesAF); // AF = isArchived False

Router.get('/getAspirasiAdmin', getAspirasiAdmin);
Router.get('/getAspirasiApproved', getAspirasiApproved);

Router.get('/getAspirasi/:id', getAspirasiById);


module.exports = Router
