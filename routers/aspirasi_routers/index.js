// PACKAGES
const express = require('express');
// ROUTER

// ENDPOINT
const Router = express.Router();
Router.get('/', (req, res) => {
    res.send('API is running.....');
});

const aspirasiApi = require('./aspirasiApi/aspirasi');
Router.use('/aspirasi', aspirasiApi);


module.exports = Router;
