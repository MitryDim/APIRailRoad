const { findById } = require('../models/trainModel');
require('dotenv').config();

// Importing train context
const Train = require("../models/trainModel");

//Create train
exports.createTrain = async (req, res) => {

    //Control of the user's admin role
    //
    //

    const {name} = req.body;
    const isNewTrain = await Train.isThisTrainInUse(name);
    if (!isNewTrain) return res.status(409).send("Train Already Exist. Please Update");
    const train = await train(req.body, ["name", "start_station", "end_station", "time_of_departure"])
    await train.save();

    res.status(200).json(train)


    //Update in the DB

    const trainInfo = {
        name: train.name,
        start_station: train.start_station,
        end_station: train.end_station,
        time_of_departure: train.time_of_departure
    }

    //return train information
    res.status(200).json({train: trainInfo})
}

//Update train
exports.trainUpdate = async (req,res,next) => {

    //Control of the user's admin role
    //
    //

    const { name } = req.body;
    const train = await Train.findById(req.user._id)

    if (train.name != name)
    {
        const isNewName = await Train.isThisNameInUse(name);
        if (!isNewName) return res.status(409).send("Name is identical, please enter a new name.");
    }

    if (train.start_station != startStation)
    {
        const isNewStartStation = await Train.isThisStartStationInUse(startStation);
        if (!isNewStartStation) return res.status(409).send("Start station is identical, please enter a new Start station.");
    }

    if(train.end_station != endStation)
    {
        const isNewEndStation = await Train.isThisEndStationInUse(endStation);
        if (!isNewEndStation) return res.status(409).send("End station is identical, please enter a new End station.")
    }

    if(train.time_of_departure != timeOfDeparture)
    {
        const isNewTimeOfDeparture = await Train.isThisTimeOfDepartureInUse(timeOfDeparture);
        if (!isNewTimeOfDeparture) return res.status(409).send("Time of departure is identical, please enter a new Time of departure.")
    }

    await Train.findByIdAndUpdate(req.train._id, req.body)
    res.status(200).send("updated successfully!");


}


exports.trainDelete = async (req,res) => {

    //Control of the user's admin role
    //
    //

    await Train.findByIdAndDelete(req.train._id, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ", docs);
        }
    });

    res.status(200).send("Train is now delete !");
}