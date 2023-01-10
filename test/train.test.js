let request = require('supertest')("http://localhost:4001")
require('dotenv').config();
const expect = require("chai").expect;

let current_token = "";
let user = {};
let trainstation = [];
let train = {}

describe('/train', function () {

    before(function (done) {
        current_token = process.env.TEST_TOKEN.trim();
        // user = process.env.TEST_USER;

        trainstation = JSON.parse(process.env.TEST_TRAINSTATION);
        train = {
            name: "test1",
            start_station: trainstation[0].name,
            end_station: trainstation[1].name,
            time_of_departure: "21/01/2023 16:30"
        }
        done();
    });

    //Create a new train
    it('POST train enregistration', async function () {
        await request
            .post('/trains/create')
            .set('authorization', 'Bearer ' + current_token)
            .send({ name: train.name, start_station: train.start_station, end_station: train.end_station, time_of_departure: train.time_of_departure })
            .expect(200)
            .expect(res => {
                expect(res.body).to.have.property("_id") //.contains({"pseudo": {} });
            }).then(res => {
                train.id = res.body['_id'];
            })
            .catch(error => {
                throw new Error('Erreur in test train enregistration ' + error.message);
            });
    });

    //Update a train
    it('UPDATE train', async function () {
        await request
            .put('/trains/update')
            .set('authorization', 'Bearer ' + current_token)
            .query({ name: train.name })
            .send({ name: train.name, start_station: train.start_station, end_station: train.end_station, time_of_departure: "22/02/2023 10:30" })
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test train update ' + error.message);
            });
    });

    //Read all trains
    it('GET trains', async function () {
        await request
            .get('/trains/read')
            .expect(200)
            .catch(error => {
                throw new Error('Erreur in test train update ' + error.message);
            });
    });

    after(function (done) {
        process.env.TEST_TRAIN = JSON.stringify(train);
        done();
    })

});