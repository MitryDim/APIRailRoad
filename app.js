require('dotenv').config();
require('./src/config/database').connect();
const express = require("express");
const userRoute = require("./src/routes/userRoutes")
const trainRoute = require("./src/routes/trainRoutes")
const trainstationRoute = require("./src/routes/trainstationRoutes")
const ticketsRoutes = require("./src/routes/ticketsRoutes")

const bodyParser = require("body-parser");
const app = express();
const expressOASGenerator = require('express-oas-generator');
const userModel= require('./src/models/userModel')
const _ = require('lodash');

expressOASGenerator.handleResponses(app, {
  predefinedSpec: function (spec) {
    _.set(
      spec,
      'components.securitySchemes.bearerAuth',
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    );
    _.set(spec, "paths['/users/profil'].get.security", [{ bearerAuth: [] }]);
    return spec;
  },
  specOutputPath: './filename.json',
  tags: ['Users',"TrainStations","Trains","Ticket"],
  alwaysServeDocs: true,
  specOutputFileBehavior: expressOASGenerator.SPEC_OUTPUT_FILE_BEHAVIOR.RECREATE,

});

// generator.init(app, function (spec) {
//   _.set(spec, 'paths["/users/{name}"].get.parameters[0].description', 'description of a parameter');
//   return spec;
// }, './test_spec.json', 1000, 'api-docs', modelNames, ['users'], SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE);


// generator.handleResponses(app, {
//   predefinedSpec: function (spec) {
//     _.set(spec, 'paths["/students/{name}"].get.parameters[0].description', 'description of a parameter');
//     return spec;
//   },
//   specOutputPath: './test_spec.json',
//   mongooseModels: modelNames,
//   alwaysServeDocs: true,
//   specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json( { type: 'application/json'}));

app.use("/users", userRoute);
app.use("/trains", trainRoute);
app.use("/trainstations", trainstationRoute)

app.use("/ticket",ticketsRoutes)

//View image upload
app.use('/trainstationsUploads', express.static('src/assets/uploads'));

expressOASGenerator.handleRequests();

//Get port in .env file 
const { API_PORT } = process.env;
const port = API_PORT;

//Server listening
const server = app.listen(port, () => {

  console.log(`Server running on port ${port}`);
});

module.exports = app;


