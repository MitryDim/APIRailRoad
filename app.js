require('dotenv').config();
require('./src/config/database').connect();
const express = require("express");
const userRoute = require("./src/routes/userRoutes")
const trainRoute = require("./src/routes/trainRoutes")
const trainstationRoute = require("./src/routes/trainstationRoutes")
const ticketsRoutes = require("./src/routes/ticketsRoutes")

const bodyParser = require("body-parser");


const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));


app.use("/users", userRoute);
app.use("/trains", trainRoute);
app.use("/trainstations", trainstationRoute)

app.use("/ticket",ticketsRoutes)

//View image upload
app.use('/trainstationsUploads', express.static('src/assets/uploads'));




module.exports = app;


