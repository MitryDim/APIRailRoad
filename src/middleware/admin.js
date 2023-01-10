const User = require('../models/userModel')

//Check if user is admin
exports.isAdmin = async (req, res, next) => {
    if (req.user != undefined) {
        if (req.user.role != "admin")
            return res.status(403).send('Unauthorized access !');
        else
            next();
    } else {
        return res.status(403).send('Unauthorized access!');
    }
}