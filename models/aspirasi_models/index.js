const express = require('express');

//import models
const aspirasi = require('./aspirasiModels/aspirasModels')

//db object
const db = {
    aspirasi
}

module.exports = db;
