const {LoginAdmin,logoutAdmin,postAdmin,getAdminById,updateAdmin,deleteAdmin,postWarga,postRt,postRw,postPerangkatDesa,postPimpinanDesa,countAllDocument,countAllSurat}=
require('../../controllers/userController/adminController');
const express = require('express');
const Router = express.Router();

Router.post('/login-admin',LoginAdmin);
Router.post('/logout-admin/:id',logoutAdmin);

Router.post('/post-admin',postAdmin);
Router.get('/get-admin/:id',getAdminById);
Router.put('/update-admin/:id',updateAdmin);
Router.delete('/delete-admin/:id',deleteAdmin);

Router.post('/makeWarga/:idUser',postWarga);
Router.post('/makeRt/:idUser',postRt);
Router.post('/makeRw/:idUser',postRw);
Router.post('/makePerangkatdesa/:idUser',postPerangkatDesa);
Router.post('/makePimpinandesa/:idUser',postPimpinanDesa);

//adshboard admin
Router.get('/count-all-document',countAllDocument);
Router.get('/count-all-surat-acara',countAllSurat);


module.exports = Router;


// note :

//login admin : http://localhost:3555/api/v1/userApi/admin/login-admin

//logout admin : http://localhost:3555/api/v1/userApi/admin/logout-admin

// post admin : http://localhost:3555/api/v1/userApi/admin/post-admin

// get admin by id : http://localhost:3555/api/v1/userApi/admin/get-admin/:id

// update admin by id : http://localhost:3555/api/v1/userApi/admin/update-admin/:id

// delete admin by id : http://localhost:3555/api/v1/userApi/admin/delete-admin/:id


// make warga : http://localhost:3555/api/v1/userApi/admin/makeWarga/:idUser

// make rt : http://localhost:3555/api/v1/userApi/admin/makeRt/:idUser

// make rw : http://localhost:3555/api/v1/userApi/admin/makeRw/:idUser

// make perangkat desa : http://localhost:3555/api/v1/userApi/admin/makePerangkatdesa/:idUser

// make pimpinan desa : http://localhost:3555/api/v1/userApi/admin/makePimpinandesa/:idUser

// count all document : http://localhost:3555/api/v1/userApi/admin/count-all-document

// count all surat acara : http://localhost:3555/api/v1/userApi/admin/count-all-surat-acara
