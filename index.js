const app = require("./app");

//Get port in .env file 
const { API_PORT } = process.env;
const port = API_PORT;

// server listening 

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;