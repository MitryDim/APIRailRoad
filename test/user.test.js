let request = require('supertest')
const mongoose = require('mongoose');
require('dotenv').config();
const app = require('../app');
const expect = require("chai").expect;


var currentResponse={}
let current_token = "";

let user =  {pseudo: "test1", email:"test1@example.com", password: "tesT1234*", role:"admin"}

describe('/users', function (){
    //Vérification de la connexion Database
    this.beforeAll(function (done) {
     mongoose.connection.on('open', done);

    });

    before(function (done) {
      mongoose.connection.dropDatabase((err, result) => {
        console.log('Database dropped');
        if (err)
          done(err);
        else
          done();
        // mongoose.connection.close(done);
      });
    });

    //User registration
    it('POST User register',   async function() {

        await request(app)
        .post('/users/register')
        .send(user)
        .expect(200)
          .expect(res => {
            expect(res.body).to.have.property("_id") //.contains({"pseudo": {} });
          }).then(res => {
          user.id = res.body['_id'];
        })
        .catch(error => {
            throw new Error('Erreur in test user register ' + error.message);
          });
    });

    //User login
    it('POST User Login', async () => {
       await request(app)
        .post('/users/login')
        .send({email: user.email, password: user.password})
        .expect(200)
        .expect(res => {
            expect(res.body).to.have.property("token") //.contains({"pseudo": {} });
          }).then(res => {                        // must be then, not a callback
            currentResponse = res.body;
            current_token = currentResponse['token'];
          
          }).catch(error => {
            // renvoyer une erreur personnalisée ici
            throw new Error('Erreur in test user login ' + error.message);
          });
          
    });

    //Get Information about the user
     it('GET User Profile', async () => {
        await request(app)
         .get('/users/profil')
         .set('authorization', "Bearer " + current_token)
         .query({email: user.email})
         .expect(200).catch(error => {
             // renvoyer une erreur personnalisée ici
             throw new Error('Erreur in test user profile ' + error.message);
           });
           
     });

         //Update information about the user
         it('PUT User update', async () => {
            await request(app)
             .put('/users/update')
             .set('authorization', 'Bearer ' + current_token)
             .send({pseudo: user.pseudo+"1", email: user.email, password: user.password})
             .expect(200).catch(error => {
                 // renvoyer une erreur personnalisée ici
                 throw new Error('Erreur in test user update ' + error.message);
               });   
         });

  after(function (done) {
    process.env.TEST_TOKEN = current_token;
    process.env.TEST_USER = JSON.stringify(user);
  done();
})

  // it('DELETE User delete', async () => {
  //   await request(app)
  //     .delete('/users/delete')
  //     .set('authorization', 'Bearer ' + current_token)
  //     .query({ email: user.email })
  //     .expect(200).catch(error => {
  //       // renvoyer une erreur personnalisée ici
  //       throw new Error('Erreur in test user update ' + error.message);
  //     });
  // });

});



// describe('/trainstation', function () {

//   //Create a new train station
//   it('POST trainstation enregistration', async function () {

//     await request(app)
//       .post('/trainstations/create')
//       .send(trainstation_1)
//       .set('authorization', 'Bearer ' + current_token)
//       .expect(200)
//       .catch(error => {
//         throw new Error('Erreur in test trainstation enregistration ' + error.message);
//       });
//   });


//   //Read all train station
//   it('GET trainstation', async function () {

//     await request(app)
//       .get('/trainstations/read')
//       .expect(200)
//       .catch(error => {
//         throw new Error('Erreur in test read all trainstation ' + error.message);
//       });
//   });
 
// });

//After test drop collection user
//after(function (done) {
    // Clear Test Data


  //After test drop collection user


    // mongoose.connection.db.dropCollection('users', (err, result) => {
    //   mongoose.connection.db.dropDatabase('test',)
    //     mongoose.connection.close(done);
    // });
//});







// it('respond with json', async () => {


//     let current_token = currentResponse['token'];
//     old_unique_token = current_token;

//     await request(app)
//     .get('/trains/read')
//     .expect(200)
//     .send({name: ""})
//     .then(res => {
//       //  assert.equal(typeof (res.body),Object)
//         // assert.equal(res.body.length,3)
//         // res.body.forEach(element => {
//         //     const prop = Object.keys(element).join('-')
//         //     assert.match(prop, /id-name-nickname/)
//         // });

//         currentResponse=res.body

//         console.log(res.body);
//     })  
// });
// });























//     it('respond with json', async () => {

//           const response = await request(app).get("/trains/read");
//              expect(response.statusCode).to.equal(200);

//             console.log(JSON.stringify(response.body));


//});
//    });




    //     request(app)
    //      //fixed!
    //     .get('/trains/read').set("accept", "application/json")
    //   //  .set('Accept-Encoding', null) // otherwise we get chunked encoding
    //     .end((err, res) => {
 
    //         response = res;
            // faire quelque chose avec la valeur de result
            //done();
   
        // .end((err, res) => {
        //   if (err) return done(err);
        //     console.log(res.text)
        //   console.log(JSON.parse(res.text))
        //   done();
        // });
        // afterEach(function(){
        //     console.log(response);
        //     console.log(response.body.attachments);
        //     console.log("    Response body: " + util.inspect(response.body,{depth: null, colors: true}) + "\n");
        //     if (this.currentTest.state == 'failed') { 
        //       console.log("    Response body: " + util.inspect(response.body,{depth: null, colors: true}) + "\n");
        //     }
        //   })  

  //});

//   const res = await request(app).get("/trains/read");

//   expect(res.status).to.eql(200)


// describe('GET /', () => {
// before((done) => async () => {

//     // Connect to the database
//     await  mongoose.connect(URI);
//     const db = mongoose.connection;
//     while (!db.readyState == 1)
//     {

//     }
//     console.log("State of database: "+mongoose.connection.readyState)
//     done();
//     // db.on('error', console.error.bind(console, 'connection error'));
//     // db.once('open', () => {
//     //   console.log('Connected to the database');
//     //   done();
//     // });
//   });
// });


  

//   describe('POST /users', () => {
//       it('should create a new user', (done) => {
//         request(app)
//           .get('/trains/read')
//           .send({})
//           .expect(200)
//           .end((err, res) => {
//             if (err) {
//               return done(err);
//             }
//             // Check that the user was saved to the database
//             // User.findOne({ username: 'testuser' }, (err, user) => {
//             //   if (err) {
//             //     return done(err);
//             //   }
//             //   assert(user.username === 'testuser');
//             //   done();
//             // });
//             done();
//           });
//       });
//     });

  

// describe('BDD function', () => {
  
//     before(function (done) {
        
       
// mongoose.Promise = global.Promise;

// mongoose.connect( URI,
// {
// }
// );

// const db = mongoose.connection;


// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function () {

// console.log("Connected successfully");
// done();
// });
//     });
// })





// describe('Router', () => {
//     it('GET users', async () =>{
//         await request(server)
//         .get('/trains/read')
//         .expect(200)
//         .then(res => {
//             assert.equal(typeof (res.body),Object)
//             assert.equal(res.body.length,3)
//             // res.body.forEach(element => {
//             //     const prop = Object.keys(element).join('-')
//             //     assert.match(prop, /id-name-nickname/)
//             // });
//         })
//     })
// })

// describe('Router', () => {
//     it('GET users', async () =>{
//         await request(server)
//         .get('/trains/read')
//         .expect(200)
//         .then(res => {
//             console.log("OK");
//             // assert.equal(typeof (res.body),Object)
//             // assert.equal(res.body.length,3)
//             // res.body.forEach(element => {
//             //     const prop = Object.keys(element).join('-')
//             //     assert.match(prop, /id-name-nickname/)
//             // });
//         })
//     })
// })


// describe("Get /trains/read", () => {
//     it("Return all trains", async () => {
//         const res = await request.get("/read");

//         expect(res.status).to.eql(200)
//         console.log(res.body);
//     })
// })

// describe('API', function () {
//     it("Says 'Hello' is 'World'", function (done) {
//       request(app)
//         .get('/api/v1')
//         .expect('Content-Type', /json/)
//         .expect(200, {
//           Hello: 'World'
//         }, done);
//     });
//   });


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
