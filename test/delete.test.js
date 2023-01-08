
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

});