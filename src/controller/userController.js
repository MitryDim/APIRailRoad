const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// importing user context
const User = require("../models/userModel");

//register
exports.createUser = async (req, res) => {

    const { email } = req.body;

    const isNewUser = await User.isThisEmailInUse(email);

    if (!isNewUser) return res.status(409).send("User Already Exist. Please Login");

    const user = await User(req.body, ["pseudo", "email", "password", "role"])

    await user.save();

    res.status(200).json(user)
}

//Login
exports.userLogIn = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) return res.status(401).send("no account exists with this email !")

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.status(201).send('email / password does not match !')
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1d',
    })

    let oldTokens = user.tokens || [];

    //vérification token expiré (supérieur à 86400 Secondes soit 1 jour)
    if (oldTokens.length) {
        oldTokens = user.tokens.filter(t => {
            const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
            if (timeDiff < 86400) {
                return t
            }
        });
    }


    //Mise à jour en BDD
    await User.findByIdAndUpdate(user._id, {
        tokens: [...oldTokens, { token, signedAt: Date.now().toString() }]
    })

    const userInfo = {
        pseudo: user.pseudo,
        email: user.email
    }

    //retourne les informations user et token
    res.status(200).json({ user: userInfo, token })

}


//Update

exports.userUpdate = async (req,res,next) => {
    const { email } = req.body;
    const user = await User.findById(req.user._id)

    if (user.email != email)
    {
    const isNewEmail = await User.isThisEmailInUse(email);
    if (!isNewEmail) return res.status(409).send("email Already Exist.");
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);
   
    await User.findByIdAndUpdate(req.user._id, req.body)
    res.status(200).send("updated successfully!");
  

}


exports.userDelete = async (req,res) => {

    const  { email } = req.query;
    console.log(email)
    if (email != undefined) {
        const user = await User.findById(req.user._id)
        if (user.email != email)
        {
            return res.status(403).send("You cannot delete an account other than yourself");
        }
    
       await User.findByIdAndDelete(req.user._id, function (err, docs) {
            if (err){
                console.log(err)
            }
            else{
                console.log("Deleted : ", docs);
            }
        });

         res.status(200).send("account is now delete !");

    }
    else {
        return res.status(400).send("please put an email");
    }
   
}

//Logout
exports.userLogOut = async (req, res) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) return res.status(401).send('Authorization fail !')

        const tokens = req.user.tokens;

        const newTokens = tokens.filter(t => t.token !== token);

        await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });

        res.status(200).send('Sign out successfully !')
    }
};

