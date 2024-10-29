const express = require('express');
const Router = express.Router();


const adminApi = require('./adminApi');
Router.use('/admin', adminApi);

const userApi = require('./userApi');
Router.use('/user', userApi);


module.exports = Router;




