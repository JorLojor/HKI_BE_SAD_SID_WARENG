const {getAllRt,createRt,updateRt,deleteRt,getRtById,postManyRt} = require('../../../controllers/administrasi_controllers/role_administration/RtController');
const express = require('express');
const Router = express.Router();


Router.get('/get',getAllRt); // 
Router.get('/getRt/:id',getRtById);
Router.post('/create',createRt);
Router.post('/post-many-rt',postManyRt);
Router.put('/update/:id',updateRt);
Router.delete('/delete/:id',deleteRt);



module.exports = Router;


// note :
// get all rt : http://localhost:3555/api/v1/rt/get
// get rt by id : http://localhost:3555/api/v1/rt/getRt/:id
// create rt : http://localhost:3555/api/v1/rt/create
// post many rt : http://localhost:3555/api/v1/rt/post-many-rt
// update rt : http://localhost:3555/api/v1/rt/update/:id
// delete rt : http://localhost:3555/api/v1/rt/delete/:id
// persetujuan surat acara : http://localhost:3555/api/v1/rt/persetujuan-surat-acara/:rtId/:suratAcaraId
