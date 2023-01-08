let request = require('supertest')("http://localhost:4001")
require('dotenv').config();
const expect = require("chai").expect;

let current_token = "";
let user = {};
let trainstation = [];
let train = {}



describe('/ticket', function () {

    before(function (done) {
        current_token = process.env.TEST_TOKEN.trim();
        train = JSON.parse(process.env.TEST_TRAIN);
        user = JSON.parse(process.env.TEST_USER);
        done();
    });

    //book ticket
    it('POST ticket book', async function () {
        await request
            .post('/ticket/book')
            .set('authorization', 'Bearer ' + current_token)
            .query({_id:train.id})
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test ticket book ' + error.message);
            });
    });


    it('POST ticket validate', async function () {
        await request
            .get('/ticket/validate')
            .set('authorization', 'Bearer ' + current_token)
            .query({ idTrain: train.id, idUser: user.id  })
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test ticket validate ' + error.message);
            });
    });

});