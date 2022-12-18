const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require('../models/userModel')

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decode.userId);

      if (!user) return res.status(403).send('unauthized access !');
      req.user = user;

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(403).send('Unauthorized access !');
      }
      if (error.name === 'okenExpiredError') {
        return res.status(498).send("Toekn expired try sign in !")
      }

      res.status(500).send("Internal server error !")

    }
  }
  else
  {
    res.status(403).send('Unauthorized access !');
  }
};


// const verifyToken = (req, res, next) => {
//   const token =
//     req.body.token || req.query.token || req.headers["x-access-token"];

//   let jwtSecretKey = process.env.JWT_SECRET_KEY;

//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const decoded = jwt.verify(token, jwtSecretKey);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// module.exports = verifyToken;