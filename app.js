require('dotenv').config();
require('./src/config/database').connect();
const express = require("express");
const userRoute = require("./src/routes/userRoutes")

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/users",userRoute);

module.exports = app;


