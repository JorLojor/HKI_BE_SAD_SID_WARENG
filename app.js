const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');


app.use(cors());

require('dotenv').config();

app.use('/assets', express.static('assets'));
// http://localhost:3555/assets/1.jpg

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const api = require('./routers');
const morgan = require('morgan');
app.use(morgan('combined'));
app.use('/api/v1', api);



mongoose.connect(process.env.DATABASE);
const db = mongoose.connection;
db.on('error', (err) => {
  console.error('Kesalahan koneksi MongoDB:', err);
});
db.once('open', () => {
  console.log('Terkoneksi ke Database ....',);
});

module.exports = app;
