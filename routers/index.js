// PACKAGES
const express = require('express');

// ROUTER

// ENDPOINT
const Router = express.Router();
Router.get('/', (req, res) => {
    res.send('--- wareng api ---');
});
// http://localhost:3555/api/v1

// user routers
const userApi = require('./user_routers/');
Router.use('/userApi', userApi);
//http://localhost:3555/api/v1/userApi

// infromasi routers
const informasiApi = require('./informasi_routers/');
Router.use('/informasi', informasiApi);
// http://localhost:3555/api/v1/informasi


// administation routers
const administrationApi = require('./administration_routers');
Router.use('/administrasi', administrationApi);
// http://localhost:3555/api/v1/administrasi


// aspirasi routers
const aspirasiApi = require('./aspirasi_routers');
Router.use('/aspiration', aspirasiApi);
// http://localhost:3555/api/v1/aspiration


module.exports = Router;
