const {
    getUserByIdDecrypt,
    getAllUser,
    getPaginateUser,
    getUserById,
    postUser,
    postManyUser,
    updateuserById,
    deleteUserById,
    getUserByName,
    getContact
  } = require('../../controllers/userController/userController');
const express = require('express');
const Router = express.Router();

Router.get('/get', getAllUser);
Router.get('/get-name', getUserByName);
Router.get('/get/paginate', getPaginateUser);


Router.get('/get/:id', getUserById);
Router.get('/get/dec/:id', getUserByIdDecrypt);
Router.post('/get/name-user', getUserByName);
Router.post('/post-user', postUser);
Router.post('/post-many-user', postManyUser);
Router.put('/update/:id', updateuserById);
Router.delete('/delete/:id', deleteUserById);
Router.get('/get-contact/:id', getContact); // http://localhost:3555/api/v1/user/get-contact


module.exports = Router;
  