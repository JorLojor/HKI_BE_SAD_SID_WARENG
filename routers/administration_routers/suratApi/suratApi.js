const express = require('express');
const Router = express.Router();
const suratController = require('../../../controllers/administrasi_controllers/suratController/suratController');
const auth = require('../../../middlewares/user_middleware/wargaValidation');
const wargaValidation = require('../../../middlewares/user_middleware/wargaValidation');


const suratCreator = require('../../../controllers/administrasi_controllers/suratController/functions/suratCreatetor');
Router.get('/get/detail-surat/:id/:jenisSurat',auth.wargaValidation,suratCreator.getSubSuratById);
// http://localhost:3555/api/v1/surat/get/detail-surat/:id/:jenisSurat


// vix bet
Router.get('/get/surat',auth.wargaValidation,suratController.getAllSuratAcaraLessDetail_TAVERSION);
Router.post('/create/suratAcara/TAversion/:idWarga',suratController.wargaCreateSurat_TAVERSION);
Router.put('/revisi-surat-warga/:suratAcaraId',suratController.suratAcaraRevisi_TAVERSION);
Router.delete('/delete/suratAcara/:userId/:suratAcaraId',suratController.deleteSuratAcaraById);
Router.get('/get/generatePdf/:idSuratAcara',suratController.generateSuratPdf_TAVERSION); //http://localhost:3555/api/v1/administrasi/surat/get/generatePdf/:idSuratAcara

//Rt
Router.put('/persetujuan-surat-acara-rt/:rtId/:suratAcaraId',suratController.persetujuanSuratAcaraRt_TAVERSION);

//Rw
Router.put('/persetujuan-surat-acara-rw/:RwId/:SuratId',suratController.persetujuanSuratAcaraRw_TAVERSION);

//perangkat desa
Router.put('/persetujuan-surat-acara-pd/:perangkatDesaId/:suratAcaraId',suratController.persetujuanSuratAcaraPerangkatDesa_TAVERSION);

//kepala desa
Router.put('/persetujuan-surat-acara-pp/:kadesId/:suratAcaraId',suratController.persetujuanSuratAcaraKades_TAVERSION);

//baypass RT 
Router.put('/baypass-rt/:suratAcaraId',suratController.baypassSuratAcaraRT_TAVERSION);

//baypass RW
Router.put('/baypass-rw/:suratAcaraId',suratController.baypassSuratAcaraRW_TAVERSION)

//baypass Perangkat Desa
Router.put('/baypass-pd/:suratAcaraId',suratController.baypassSuratAcaraKasi_TAVERSION);

//passing surat acara
Router.put('/passing/:suratAcaraId',suratController.passingSuratAcara_TAVERSION);

// archive surat acara
Router.put('/archive/:suratAcaraId/:isArchive',suratController.arsipSuratAcara_TAVERSION);

module.exports = Router;


// note :
// create surat acara : http://localhost:3555/api/v1/surat/create/suratAcara/TAversion/:idWarga
// revise surat acara : http://localhost:3555/api/v1/surat/revisi-surat-warga/:suratAcaraId
// delete surat acara : http://localhost:3555/api/v1/surat/delete/suratAcara/:userId/:suratAcaraId
// generate pdf surat acara : http://localhost:3555/api/v1/surat/get/generatePdf/:idSuratAcara

// persetujuan surat acara rt : http://localhost:3555/api/v1/surat/persetujuan-surat-acara-rt/:rtId/:suratAcaraId
// persetujuan surat acara rw : http://localhost:3555/api/v1/surat/persetujuan-surat-acara-rw/:rwId/:suratAcaraId
// persetujuan surat acara perangkat desa : http://localhost:3555/api/v1/surat/submit/:perangkatDesaId/:suratAcaraId
// persetujuan surat acara kades : http://localhost:3555/api/v1/surat/submit/:kadesId/:suratAcaraId


// get all surat : http://localhost:3555/api/v1/surat/get/surat

// archive surat acara : http://localhost:3555/api/v1/surat/archive/:suratAcaraId/:isArchive

// baypass surat acara : http://localhost:3555/api/v1/surat/baypass/:suratAcaraId

// baypass surat acara RT : http://localhost:3555/api/v1/surat/baypassRT/:suratAcaraId
// baypass surat acara RW : http://localhost:3555/api/v1/surat/baypassRW/:suratAcaraId
// baypass surat acara Perangkat Desa : http://localhost:3555/api/v1/surat/baypassKasi/:suratAcaraId

// passing surat acara : http://localhost:3555/api/v1/surat/passing/:suratAcaraId

// revisi surat acara : http://localhost:3555/api/v1/surat/revisi-surat-warga/:suratAcaraId
