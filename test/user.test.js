const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

require('dotenv').config();
const app = require('../app');

const { MONGO_URI_TEST } = process.env;

const URI = process.env.MONGO_URI_TEST || MONGO_URI_TEST




const agent = request.agent(app)

describe('BDD function', () => {
  
    before(function (done) {
        
       
mongoose.Promise = global.Promise;

mongoose.connect(URI,
{
}
);

const db = mongoose.connection;


db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
console.log("Connected successfully");
});
    });
})



// beforeAll(async () => await db.connect());
// afterEach(async () => await db.clear());
// afterAll(async () => await db.close());


// beforeEach(async () => {
//     await mongoose.connect(URI);
//   });
  
//   /* Closing database connection after each test. */
//   afterEach(async () => {
//     await mongoose.connection.close();
//   });


//   describe('User Integration Test', () => {
//     // make sure app is imported without issues
//     it('Has App Defined', () => {
//         expect(app).toBeDefined();
//     });

//     let server;

//     beforeAll(async () => {
//         // Clear Test Data
//         await User.deleteMany({});
//         await Profile.deleteMany({});
//         server = await app.listen(3001);
//     });

//     afterAll(async (done) => {
//         // Clear Test Data
//         await User.deleteMany({});
//         await Profile.deleteMany({});
//         // Close server
//         await server.close(done);
//     });
// });







// afterEach((done) => {
//   // Drop the collection and close the connection
//   mongoose.connection.db.dropCollection('users', (err, result) => {
//     mongoose.connection.close(done);
//   });
// });

// describe('POST /users', () => {
//   it('should create a new user', (done) => {
//     request(app)
//       .post('/users')
//       .send({ username: 'testuser', password: 'password' })
//       .expect(201)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//         // Check that the user was saved to the database
//         User.findOne({ username: 'testuser' }, (err, user) => {
//           if (err) {
//             return done(err);
//           }
//           assert(user.username === 'testuser');
//           done();
//         });
//       });
//   });
// });
