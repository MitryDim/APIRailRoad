const express = require("express");

const bcrypt = require('bcryptjs')
const { createUser, userLogIn,userProfil,userUpdate, userDelete, userLogOut} = require('../controller/userController');

const {validateInputRegister,validateInputLogin,validateInputUpdate} = require('../middleware/validation/userValidation')
const {isAuth} = require("../middleware/auth");

const router = express.Router()

router.post('/register',validateInputRegister,createUser);
router.post('/login',validateInputLogin,userLogIn);
router.get("/profil", isAuth,userProfil);
router.put('/update',isAuth,validateInputUpdate,userUpdate)
router.delete('/delete',isAuth,userDelete)
router.post('/logout',isAuth,userLogOut);

module.exports = router;