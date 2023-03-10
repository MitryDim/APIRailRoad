require('dotenv').config();
require('./src/config/database').connect();
const express = require("express");
const userRoute = require("./src/routes/userRoutes")
const trainRoute = require("./src/routes/trainRoutes")
const trainstationRoute = require("./src/routes/trainstationRoutes")
const ticketsRoutes = require("./src/routes/ticketsRoutes")
const cors = require("cors")
const bodyParser = require("body-parser");
const app = express();


const _ = require('lodash');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger.json')



app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json( { type: 'application/json'}));


app.use("/users", userRoute);
app.use("/trains", trainRoute);
app.use("/trainstations", trainstationRoute)

app.use("/ticket",ticketsRoutes)

//View image upload
app.use('/trainstationsUploads', express.static('src/assets/uploads'));
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))



//Get port in .env file 
const { API_PORT } = process.env;
const port = API_PORT;

// server listening 
const server = app.listen(port, () => {

  console.log(`Server running on port ${port}`);
 
});

module.exports = app;


