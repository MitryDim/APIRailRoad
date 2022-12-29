require('dotenv').config();

//Importing trainstation context
const Trainstation = require("../models/trainstationModel");
const Train = require("../models/trainModel");
const DIR = './'
const fs = require('fs');
const path = require('path');



//Create train station
exports.createTrainstation = async (req, res) => {
    const { name, open_hour, close_hour } = req.body;
    console.log(req.body);

    const isNewTrainstation = await Trainstation.isThisNameInUse(name);
    if (!isNewTrainstation) return res.status(409).send("Train station already exist. Please Update");
    let imgUrl = "";

    if (req.file) imgUrl = `src/assets/uploads/${name}${path.extname(req.file.filename)}`;

    const trainstation = new Trainstation
        (
            {
                name: name,
                open_hour: open_hour,
                close_hour: close_hour,
                image: imgUrl
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
    res.status(200).json({ trainstationInfo })
}

//Update train station
exports.trainstationUpdate = async (req, res, next) => {

    const { name } = req.query;
    const newNameOftrainStation = req.body.name;

    const trainstation = await Trainstation.findOne({ name })
    console.log(trainstation)

    if (!trainstation)
        return res.status(404).send("Train station not found");

    if (trainstation.name != newNameOftrainStation) {
        const isNewName = await Trainstation.isThisNameInUse(newNameOftrainStation);
        if (!isNewName) return res.status(409).send("Name is identical, please enter a new name.");
    }

    try {
        await Trainstation.findOneAndUpdate({ name }, req.body)

        if (req.file) {
            let getImageName = "";
            let Imagename = "";
            getImageName = `src/assets/uploads/${newNameOftrainStation}${path.extname(req.file.filename)}`;
            console.log("req.file : " + getImageName.match(/\/([^\/?#]+)[^\/]*$/)[1]);

            if (trainstation.image) {
                Imagename = trainstation.image.match(/\/([^\/?#]+)[^\/]*$/)[1];

                if (getImageName.match(/\/([^\/?#]+)[^\/]*$/)[1] != Imagename)
                    if (fs.existsSync(DIR + trainstation.image))
                        fs.unlinkSync(DIR + trainstation.image);
            }
            await Trainstation.findOneAndUpdate({ newNameOftrainStation }, { image: getImageName[1] })
        }

        await Train.updateMany({ start_station: name }, { start_station: newNameOftrainStation })
        await Train.updateMany({ end_station: name }, { end_station: newNameOftrainStation })
    } catch (error) {

        console.log(error);
        return res.status(500).send(error);
    }

    res.status(200).send("updated successfully!");
}

exports.trainstationFindAll = async (req, res, next) => {

    const { sortBy } = req.query;
    let sort = {}
    if (sortBy) {
        const parts = req.query.sortBy.split(";");

        for (let i = 0; i < parts.length; i++) {
            let split_sort = parts[i].split(":");
            sort[(split_sort[0].toString())] = split_sort[1];
        }
    }

    const trainstation = await Trainstation.find({}).sort(sort).cursor();

    let trainstationInfo = {
        elements: []
    }

    for (let doc = await trainstation.next(); doc != null; doc = await trainstation.next()) {
        const { image } = doc
        let imgUrl = "";

        if (image) {
            let getImageName = image.match(/\/([^\/?#]+)[^\/]*$/);
            if (getImageName)
                imgUrl = `http://localhost:${process.env.API_PORT}/trainstationsUploads/${getImageName[1]}`;

        }

        trainstationInfo.elements.push({
            name: doc.name,
            open_hour: doc.open_hour,
            close_hour: doc.close_hour,
            image: imgUrl,

        })


    }

    if (!trainstationInfo || trainstationInfo.length === 0) return res.status(404).send("No trainstations found");

    res.status(200).json(trainstationInfo.elements);

}

//methode Delete train station
exports.trainstationDelete = async (req, res) => {
    try {

        const { name } = req.query
        const trainstationInfo = await Trainstation.findOne({ name })

        if (!trainstationInfo)
            return res.status(404).send("Train station not found");

        // contrôle si une image a été upload
        if (trainstationInfo.image)
            //vérification si l'image est existante localement si c'est le cas on supprime l'image
            if (fs.existsSync(DIR + trainstationInfo.image))
                fs.unlinkSync(DIR + trainstationInfo.image);

        //suppresion de la station
        await Trainstation.findOneAndDelete({ name }), function (err, docs) {
            if (err) {
                console.log("error : " + err);
                throw new Error("error when deleting trainstation")
            }
            else {
                console.log("Deleted : ", docs);
            }
        };

        //suppression des trains qui comporte la station
        await Train.findOneAndDelete({ start_station: req.query.name }), function (err, docs) {
            if (err) {
                console.log(err)
                throw new Error("error when deleting start_station")
            }
        };

        await Train.findOneAndDelete({ end_station: req.query.name }), function (err, docs) {
            if (err) {
                console.log(err)
                throw new Error("error when deleting end_station")
            }
        }

        res.status(200).send("Train station and trains belonging to the station is now delete !");

    } catch (error) {
        //  console.log(error);
        res.status(500).send("error when deleting trainstation ");

    }


}