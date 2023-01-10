const express = require("express");
const {createTrainstation, trainstationUpdate, trainstationDelete,trainstationFindAll} = require('../controller/trainstationController');
const { validateInputCreate, validateInputUpdate } = require('../middleware/validation/trainstationValidation');
const {isAuth} = require("../middleware/auth");
const {isAdmin} = require("../middleware/admin");
const fileUpload = require("../utils/fileUpload");

const router = express.Router();

router.post('/create', isAuth, isAdmin, fileUpload(), validateInputCreate, createTrainstation);
router.put('/update', isAuth, isAdmin, fileUpload(), validateInputUpdate, trainstationUpdate);
router.get('/read',trainstationFindAll)
router.delete('/delete', isAuth,isAdmin, trainstationDelete);

module.exports = router;