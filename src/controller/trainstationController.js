require('dotenv').config();

//Importing trainstation context
const Trainstation = require("../models/trainstationModel");

//Create train station
exports.createTrainstation = async (req, res) => {

    //Control of the user's admin role
    //
    //

    const {name} = req.body;
    const isNewTrainstation = await Trainstation.isThisNameInUse(name);
    if (!isNewTrainstation) return res.status(409).send("Train station already exist. Please Update");
    const trainstation = await Trainstation(req.body, ["name", "open_hour", "close_hour", "image"])
    await trainstation.save();  

    //constante avec les informations de la station de train 
    const trainstationInfo = {
        name: trainstation.name,
        open_hour: trainstation.open_hour,
        close_hour: trainstation.close_hour,
        image: trainstation.image
    }

    //Returns trainstation information avec le status 200 (ok)
    res.status(200).json({trainstationInfo})
}

//Update train station
exports.trainstationUpdate = async (req,res,next) => {

    //Control of the user's admin role
    //
    //

    const {name} = req.body;
    const trainstation = await Trainstation.findById(req.user._id)

    if (trainstation.name != name)
    {
        const isNewName = await Trainstation.isThisNameInUse(name);
        if (!isNewName) return res.status(409).send("Name is identical, please enter a new name.");
    }

    if (trainstation.open_hour != openHour)
    {
        const isNewOpenHour = await Trainstation.isThisOpenHourInUse(openHour);
        if (!isNewOpenHour) return res.status(409).send("Open Hour is identical, please enter a new Open Hour.");
    }

    if(trainstation.close_hour != closeHour)
    {
        const isNewCloseHour = await Trainstation.isThisCloseHourInUse(closeHour);
        if (!isNewCloseHour) return res.status(409).send("Close Hour is identical, please enter a new Close Hour.")
    }

    if(trainstation.image != image)
    {
        const isNewImage = await Trainstation.isThisImageInUse(image);
        if (!isNewImage) return res.status(409).send("Image is identical, please upload a new Image.")
    }

    await Train.findByIdAndUpdate(req.train._id, req.body)
    res.status(200).send("updated successfully!");
}

//Delete train station
exports.trainstationDelete = async (req,res) => {

    //Control of the user's admin role
    //
    //

    await Trainstation.findByIdAndDelete(req.trainstation._id, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Deleted : ", docs);
        }
    });

    //Delete of the trains belonging to the station
    //
    //

    res.status(200).send("Train station and trains belonging to the station is now delete !");
}