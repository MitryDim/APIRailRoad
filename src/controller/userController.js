const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")

require('dotenv').config();

// importing user context
const User = require("../models/userModel");

//register
exports.createUser = async (req, res,next) => {
// #swagger.tags = ['Users']
    const { email, pseudo, password, role } = req.body;
    // check de l'email
    const isNewUser = await User.isThisEmailInUse(email);

    if (!isNewUser) return res.status(409).send("User Already Exist. Please Login");

    const user = await User({pseudo : pseudo, email: email,password: password,role: role})

    await user.save();

    const userInfo = {
        pseudo: user.pseudo,
        email: user.email,
        role: user.role,
        _id: user._id
    }

    res.status(200).json(userInfo)
    return next();
}

//Login
exports.userLogIn = async (req, res,next) => {
    // #swagger.tags = ['Users']
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
    return next();
}

exports.userProfil = async (req, res,next) => {
    // #swagger.tags = ['Users']
    const { email } = req.query
    if (req.user.email != email && !["employee", "admin"].includes(req.user.role))
        return res.status(403).send("you don't have permissions to view this profil")

    const user = await User.findOne({ email })
    if (!user)
        return res.status(404).send("no account exists with this email!")
        

    const userInfo = {
        pseudo: user.pseudo,
        email: user.email,
        role: user.role
    }

    res.status(200).json(userInfo)
    return next();
}


//Update
exports.userUpdate = async (req, res, next) => {
    // #swagger.tags = ['Users']
    const { pseudo,password, email, role } = req.body

    let id = req.query._id
    let userId = req.user._id

    //verification si ID passé en paramètre dans le body
    if (id != undefined) {
        id = mongoose.Types.ObjectId(id)

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

    await User.findByIdAndUpdate(userId, {pseudo: pseudo,email: email,password: password,role: role})
    res.status(200).send("updated successfully!");
    return next();
}


exports.userDelete = async (req, res,next) => {
    // #swagger.tags = ['Users']
    const { email } = req.query;
    if (email != undefined) {
        const user = await User.findById(req.user._id)
        
        if (user.email != email) {
            return res.status(403).send("You cannot delete an account other than yourself");
        }

        await User.findByIdAndDelete(req.user._id).catch((error) => {
            return res.status(500).send("server error" + error.message)
        });

        res.status(200).send("account is now delete !");
        next();
    }
    else {
        return res.status(400).send("please put an email");
    }
}

//Logout
exports.userLogOut = async (req, res,next) => {
    // #swagger.tags = ['Users']
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) return res.status(401).send('Authorization fail !')

        const tokens = req.user.tokens;

        const newTokens = tokens.filter(t => t.token !== token);

        await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });

        res.status(200).send('Sign out successfully !')
        return next();
    }
};

