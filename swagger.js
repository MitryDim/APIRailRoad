
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0', autoHeaders: false})
require('dotenv').config();

//Get port in .env file 
const { API_DOMAINE } = process.env;
const domaine = API_DOMAINE || "localhost";

const doc = {
    info: {
        version: '1.0.0',      // by default: '1.0.0'
        title: 'RailRoad API',        // by default: 'REST API'
        description: '',  // by default: ''
    },
    host: `${domaine}:4001`,      // by default: 'localhost:3000'
    basePath: '/',  // by default: '/'
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer'
            }
        }
    }, 
    schemes: [],   // by default: ['http']
    consumes: [],  // by default: ['application/json']
    produces: [],  // by default: ['application/json']
    tags: [        // by default: empty Array
        {
            "name": "Users",
            "description": " Users routes"
        },
        {
            "name": "Trainstations"
        },
        {
            "name": "Trains"
        },
        {
            "name": "Tickets"
        }
        // { ... }
    ],

};

const outputFile = './swagger.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles,doc)