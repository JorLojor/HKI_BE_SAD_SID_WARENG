const {getPortal,postPortal,getPortalById,putPortal,deletePortal}=
require('../../../controllers/informasi_controllers/portalController');
const express = require('express');
const Router = express.Router();

Router.get('/get-portal',getPortal);
Router.post('/post-portal',postPortal);
Router.get('/get-portal/:id',getPortalById);
Router.put('/update-portal/:id',putPortal);
Router.delete('/delete-portal/:id',deletePortal);

module.exports = Router;