const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require('../models/userModel')

exports.isAuth = async (req, res, next) => {
  /* #swagger.security = [{
              "bearerAuth": []
       }] */

  if (req.headers && req.headers.authorization) {
    let token = ""
    if (req.headers.authorization.toLowerCase().startsWith("bearer"))
        token= req.headers.authorization.split(' ')[1]
    else
      token = req.headers.authorization


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
      

     return res.status(500).send("Internal server error !")
    }
  }
  else
    return res.status(401).send('Unauthorized access !');

  
    
   
  
};