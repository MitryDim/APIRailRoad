const mongoose = require("mongoose");


mongoose.set('strictQuery', false);


let URI = "";

const { MONGO_URI } = process.env;
const { MONGO_URI_TEST } = process.env;

if (process.env.NODE_ENV.trim() !== 'test')
  URI = process.env.MONGO_URI || MONGO_URI
else
   URI = process.env.MONGO_URI_TEST || MONGO_URI_TEST


exports.connect = async () => {
  await mongoose
    .connect(URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
