const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose")

require('dotenv').config();

// importing user context
const User = require("../models/userModel");
const { func } = require('joi');

//register
exports.createUser = async (req, res) => {

    const { email } = req.body;
    // check de l'email
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

exports.userProfil = async (req, res) => {
    const { email } = req.query
    if (req.user.email != email && !["employee","admin"].includes(req.user.role))
        return res.status(403).send("you don't have permissions to view this profil")

    const user = await User.findOne({ email })

    const userInfo = {
        pseudo: user.pseudo,
        email: user.email
    }

    res.status(200).json(userInfo)
}


//Update
exports.userUpdate = async (req, res, next) => {
    const { email, role } = req.body

    let id = req.body._id
    let userId = req.user._id

    //verification si ID passé en paramètre dans le body
    if (id != undefined) 
    {
        id = mongoose.Types.ObjectId(id)
        console.log(id)
        if ((id != req.user._id && req.user.role != "admin"))
            return res.status(403).send("You cannot update an account other than yourself")
        else
            userId = id
    }


    //verification si un rôle est passé en paramètre
    if (role != undefined && req.user.role != "admin")
        return res.status(403).send("You don't have permissions for update this role.")


    const user = await User.findById(userId)
    //check de l'email
    if (user.email != email) {
        const isNewEmail = await User.isThisEmailInUse(email);
        if (!isNewEmail) return res.status(409).send("email Already Exist.");
    }
    await User.findByIdAndUpdate(userId, req.body)
    res.status(200).send("updated successfully!");
}


exports.userDelete = async (req, res) => {
    const { email } = req.query;
    console.log(email)
    if (email != undefined) {
        const user = await User.findById(req.user._id)
        if (user.email != email) {
            return res.status(403).send("You cannot delete an account other than yourself");
        }

        await User.findByIdAndDelete(req.user._id).then(function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
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

