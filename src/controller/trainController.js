require('dotenv').config();

const { default: mongoose } = require('mongoose');
// Importing train context
const Train = require("../models/trainModel");
const Trainstation = require("../models/trainstationModel")

//Create train
exports.createTrain = async (req, res) => {

    const {name} = req.body;
    const isNewTrain = await Train.isThisNameInUse(name);

    if (!isNewTrain) return res.status(409).send("Train Already Exist. Please Update");

    const train = await Train(req.body, ["name", "start_station", "end_station", "time_of_departure"])
    await train.save();


    //Update in the DB
    const trainInfo = {
        name: train.name,
        start_station: train.start_station,
        end_station: train.end_station,
        time_of_departure: train.time_of_departure
    }

    //return train information
    res.status(200).json({trainInfo})
}

//Update train
exports.trainUpdate = async (req,res,next) => {
    let {_id} = req.query;

    if (_id == undefined)
        return res.status(400).json({error: "No train id provided"});

    id = mongoose.Types.ObjectId(_id);
    
    const train = await Train.findById(id);

    if (train == null)
        return res.status(404).json({error: "Train Not Found"});

    const {name, start_station, end_station } = req.body;


    if (train.name != name)
    {
        const isNewName = await Train.isThisNameInUse(name);
        if (!isNewName) return res.status(409).send("Name is identical, please enter a new name.");
    }

    if (train.start_station != start_station)
    {
        const isNewStartStation = await Trainstation.isThisNameInUse(start_station);
        if (isNewStartStation) return res.status(409).send("Start station not exist, please enter an existing start station.");
    }

    if(train.end_station != end_station)
    {
        const isNewEndStation = await Trainstation.isThisNameInUse(end_station);
        if (isNewEndStation) return res.status(409).send("End station not exist, please enter an existing end station.")
    }


    await Train.findByIdAndUpdate(id,req.body) //findByIdAndUpdate(req.train._id, req.body)
    res.status(200).send("updated successfully!");
}


exports.trainDelete = async (req,res) => {

    let {_id} = req.query;

    if (_id == undefined)
        return res.status(400).json({error: "No train id provided"});
    
    const id = mongoose.Types.ObjectId(_id);
        
    await Train.findByIdAndDelete(id).then(function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ", docs);
        }
    });

    res.status(200).send("Train is now delete !");
}
