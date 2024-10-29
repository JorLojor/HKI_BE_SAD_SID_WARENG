const administration_DB = require('./administration_models/index');
const aspiration_DB = require('./aspirasi_models/index');
const informasi_DB = require('./informasi_models/index');
const user_DB = require('./user_models/index');

const models = {
    administration_DB,
    aspiration_DB,
    informasi_DB,
    user_DB
}

module.exports = models;

