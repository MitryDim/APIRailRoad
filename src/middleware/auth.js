//Importing token context
const jwt = require("jsonwebtoken");
require('dotenv').config();

//Importing user context
const User = require('../models/userModel')

//Authentification
exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decode.userId);

      if (!user) return res.status(401).send('unauthized access !');
      req.user = user;

     return next();
     
    } catch (error) {
      if (error.name === 'JsonWebTokenError') 
        return res.status(401).send('Unauthorized access !');
      
      if (error.name === 'TokenExpiredError') 
        return res.status(403).send("Token expired try sign in !")
      

      res.status(500).send("Internal server error !")
    }
  }
  else
    res.status(401).send('Unauthorized access !');
  
};