const express = require("express");
const {isAuth} = require("../middleware/auth");
const {bookTickets,validTickets} = require("../controller/ticketController");


const router = express.Router();

router.post('/book', isAuth, bookTickets);
router.get('/validate', isAuth, validTickets);



module.exports = router;