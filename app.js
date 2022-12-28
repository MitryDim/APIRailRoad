require('dotenv').config();
require('./src/config/database').connect();
const express = require("express");
const userRoute = require("./src/routes/userRoutes")
const trainRoute = require("./src/routes/trainRoutes")
const trainstationRoute = require("./src/routes/trainstationRoutes")
const bodyParser = require("body-parser");
const multer = require('multer');


const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));


app.use("/users", userRoute);
app.use("/trains", trainRoute);
app.use("/trainstations", trainstationRoute)

app.use('/trainstationsUploads', express.static('src/assets/uploads'));





module.exports = app;


