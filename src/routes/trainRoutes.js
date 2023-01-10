const express = require("express");
const {createTrain, trainUpdate, trainDelete,trainFindAll} = require('../controller/trainController');
const {validateInputCreate,validateInputUpdate} = require('../middleware/validation/trainValidation');
const {isAdmin} = require("../middleware/admin");
const {isAuth} = require("../middleware/auth");

const router = express.Router();

router.post('/create', isAuth, isAdmin, validateInputCreate, createTrain);
router.get('/read',trainFindAll)
router.put('/update',isAuth, isAdmin, validateInputUpdate, trainUpdate);
router.delete('/delete', isAuth,isAdmin, trainDelete);

module.exports = router;