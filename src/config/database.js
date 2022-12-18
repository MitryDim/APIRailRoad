const mongoose = require("mongoose");


mongoose.set('strictQuery', false);

const { MONGO_URI } = process.env;

const URI = process.env.MONGO_URI || MONGO_URI

exports.connect = () => {
  // Connecting to the database
  mongoose
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