require('dotenv').config();
const { json } = require('express');
const mongoose = require('mongoose');



const Ticket = require("../models/ticketModel");
const Train = require("../models/trainModel");
const User = require("../models/userModel");


exports.bookTickets = async (req, res, next) => {

    const userId = req.user._id
    let idTrain = req.query._id

    if (mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(idTrain)) {
        idTrain = mongoose.Types.ObjectId(idTrain)
        const ticket = new Ticket
            (
                {
                    userID: userId,
                    trainID: idTrain
                }
            )

        await ticket.save();
        res.status(200).send("Ticket booked !");
    }
    else
        res.status(500).send('server error');
}


exports.validTickets = async (req, res, next) => {

    const userId = req.user._id
    const { idTrain, idUser } = req.query

    if (mongoose.Types.ObjectId.isValid(idTrain) && mongoose.Types.ObjectId.isValid(idUser)) {
        const userinformations = await User.findOne({_id: idUser})

        if (req.user.role == "user")
            return res.status(403).send('You are not allowed to valid tickets')


        if (!userinformations)
            return res.status(400).send('user not found');

        const TrainInformations = await Train.findOne({ _id: idTrain })

        if (!TrainInformations)
            return res.status(400).send('train not found');

        const ticket = await Ticket.findOne({ userID: userinformations._id, trainID: TrainInformations._id })

        if (!ticket)
            return res.status(400).send('ticket not found');

        const ticketInfo = {
            userPseudo: userinformations.pseudo,
            userEmail: userinformations.email,
            train: TrainInformations.name,
            start_station: TrainInformations.start_station,
            end_station: TrainInformations.end_station

        }

        res.status(200).json({ tickerinfo: ticketInfo });

    }
    else
        res.status(500).send('server error');


}