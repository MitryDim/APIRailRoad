require('dotenv').config();

//Get port in .env file 
const { API_PORT } = process.env;
const port = API_PORT;

let request = require('supertest')(`http://localhost:${port}`)
const expect = require("chai").expect;

let current_token = "";
let user = {};
let trainstation = [];
let train = {}



describe('Delete train', function () {

    before(function (done) {
        current_token = process.env.TEST_TOKEN.trim();
        train = JSON.parse(process.env.TEST_TRAIN);
        done();
    });

    it('DELETE train', async function () {
        await request
            .delete('/trains/delete')
            .set('authorization', 'Bearer ' + current_token)
            .query({ name: train.name })
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test delete train ' + error);
            });
    });
});

describe('Delete train', function () {
    before(function (done) {
        trainstation = JSON.parse(process.env.TEST_TRAINSTATION);
        done();
    });

    it("DELETE trainstation ", async function () {
        for (const testCase of trainstation) {
            await request
                .delete('/trainstations/delete')
                .set('authorization', 'Bearer ' + current_token)
                .query({ name: testCase.name })
                .expect(200)
                .catch(error => {
                    throw new Error('Erreur in test trainstation trainstation ' + error.message);
                });
        };
    });
});

describe('Delete user', function () {
    before(function (done) {
        user = JSON.parse(process.env.TEST_USER);
        done();
    });

    it('DELETE user', async function () {
        await request
            .delete('/users/delete')
            .set('authorization', 'Bearer ' + current_token)
            .query({ email: user.email })
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test delete user ' + error.message);
            });
    });

});


