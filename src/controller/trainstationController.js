require('dotenv').config();

//Importing trainstation context
const Trainstation = require("../models/trainstationModel");
const Train = require("../models/trainModel");
const Multer = require('multer');
 
let storage = Multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../assets/uploads" )
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now())
    }
});
 
//Create train station
exports.createTrainstation = async (req, res) => {
    const {name,open_hour,close_hour} = req.body;
    const isNewTrainstation = await Trainstation.isThisNameInUse(name);
    if (!isNewTrainstation) return res.status(409).send("Train station already exist. Please Update");
   // const trainstation = await Trainstation(req.body, ["name", "open_hour", "close_hour", "image"])
   const uploadImg = multer({storage: storage}).single('image');

    const trainstation = new Trainstation(
        {
            name: name,
            open_hour: open_hour,
            close_hour: close_hour,
            image: req.file.path    

            
        }
    )
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

    const {name} = req.query;
    const newNameOftrainStation = req.body.name;

    const trainstation = await Trainstation.findOne({name})
    console.log(trainstation)
    
    if (!trainstation)
        return res.status(404).send("Train station not found");
        
    if (trainstation.name != newNameOftrainStation)
    {
        const isNewName = await Trainstation.isThisNameInUse(newNameOftrainStation);
        if (!isNewName) return res.status(409).send("Name is identical, please enter a new name.");
    }
    
    try {
        await Trainstation.findOneAndUpdate({name}, req.body)
        await Train.updateMany({start_station: name},{start_station : newNameOftrainStation})
        await Train.updateMany({end_station: name},{end_station : newNameOftrainStation})
    } catch (error) {
        res.status(500).send(error);
    }

   
    res.status(200).send("updated successfully!");
   
    
}

exports.trainstationFindAll = async (req,res,next) => {

    const {sortBy} = req.query;
    let sort = {}
    if (sortBy) {
        const parts = req.query.sortBy.split(";");

        for (let i = 0; i < parts.length; i++) {
            let split_sort = parts[i].split(":");
            sort[(split_sort[0].toString())] = split_sort[1] ;
        }
    }

    const trainstation =  await Trainstation.find({}).sort(sort);

    if (!trainstation || trainstation.length === 0) return res.status(404).send("No trainstations found");

    res.status(200).json(trainstation);

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