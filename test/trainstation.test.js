
require('dotenv').config();
const fs = require('fs');

//Get port in .env file 
const { API_PORT } = process.env;
const port = API_PORT;

//Get Domaine in .env file 
const { API_DOMAINE } = process.env;
const domaine = API_DOMAINE || "localhost";


const request = require('supertest')(`http://${domaine}:${port}`)


const test_Trainstation = [
    { name: "trainstation1", open_hour: "08:00", close_hour: "17:00", image: `./test/test.jpg` },
    { name: "trainstation2", open_hour: "09:00", close_hour: "16:00", image: `./test/test.jpg` }
];

let current_token = "";
let user = {};

describe('/trainstation', function () {

    before(function (done) {
        current_token = process.env.TEST_TOKEN.trim();
        user = process.env.TEST_USER;
        done();
    });

    //Create a new train station
    for (const testCase of test_Trainstation) {
        it('POST trainstation enregistration', async function () {
            await request
                .post('/trainstations/create')
                .set('authorization', 'Bearer ' + current_token)
                .attach('image', testCase.image)
                .field({ name: testCase.name, open_hour: testCase.open_hour, close_hour: testCase.close_hour })
                .expect(200)
                .catch(error => {
                    throw new Error('Erreur in test trainstation enregistration ' + error.message);
                });
        });
    };


    //Read all train station
    it('GET trainstation', async function () {
        await request
            .get('/trainstations/read')
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test read all trainstation ' + error.message);
            });
    });


    //Update a train station
    it('PUT trainstation Update', async function () {
        await request
            .put('/trainstations/update')
            .query({ name: test_Trainstation[0].name })
            .set('authorization', 'Bearer ' + current_token)
            .attach('image', test_Trainstation[0].image)
            .field({ name: test_Trainstation[0].name, open_hour: "09:00", close_hour: test_Trainstation[0].close_hour })
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test trainstation enregistration ' + error);
            });
    });

    after(function (done) {
        process.env.TEST_TRAINSTATION = JSON.stringify(test_Trainstation);
        done();
    })
    
});