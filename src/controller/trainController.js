require('dotenv').config();

// Importing train context
const Train = require("../models/trainModel");
const Trainstation = require("../models/trainstationModel")

//Create train
exports.createTrain = async (req, res) => {

    const { name } = req.body;
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
    res.status(200).json({ trainInfo })
}

//Update train
exports.trainUpdate = async (req, res, next) => {
    let nameOfTrain = req.query.name;

    if (nameOfTrain == undefined)
        return res.status(400).json({ error: "No train id provided" });

    // id = mongoose.Types.ObjectId(_id);

    const train = await Train.findOne({ name: nameOfTrain });

    if (train == null)
        return res.status(404).json({ error: "Train Not Found" });

    const { name, start_station, end_station } = req.body;


    if (train.name != name) {
        const isNewName = await Train.isThisNameInUse(name);
        if (!isNewName) return res.status(409).send("Name is identical, please enter a new name.");
    }

    if (train.start_station != start_station) {
        const isNewStartStation = await Trainstation.isThisNameInUse(start_station);
        if (isNewStartStation) return res.status(409).send("Start station not exist, please enter an existing start station.");
    }

    if (train.end_station != end_station) {
        const isNewEndStation = await Trainstation.isThisNameInUse(end_station);
        if (isNewEndStation) return res.status(409).send("End station not exist, please enter an existing end station.")
    }


    await Train.findByIdAndUpdate(train._id, req.body) //findByIdAndUpdate(req.train._id, req.body)
    res.status(200).send("updated successfully!");
}


exports.trainFindAll = async (req, res) => {
    let sort = {};
    let train = {}




    // train = await Train.find({})
    const { station_name, type, sortBy, filter } = req.query;

    let limit = req.query.limit || 10;

    let skip = req.query.skip || 0;


    if (sortBy) {
        const parts = req.query.sortBy.split(";");

        for (let i = 0; i < parts.length; i++) {
            let split_sort = parts[i].split(":");
            sort[(split_sort[0].toString())] = split_sort[1] === "desc" ? -1 : 1;
        }
    }

    switch (type) {
        case "start":
            train = await Train.find({ start_station: station_name }).limit(limit).skip(skip).sort(sort)
            break;
        case "arrival":
            train = await Train.find({ end_station: station_name }).limit(limit).skip(skip).sort(sort)
            break;
        default:
            train = await Train.find().limit(limit).skip(skip).sort(sort)


            break;
    }

    if (filter) {
        function isSingle(filter) {
            return (filter && 'o' in filter && 'm' in filter && 'v' in filter);
        }

        function isComposite(filter) {
            return (filter && 'lo' in filter);
        }

        function createBody(filter) {

            if (isComposite(filter)) {
                var bdy = "";
                if (filter.v.length > 1) {
                    var o = filter.lo;
                    return "(" + createBody(filter.v.shift()) + " " + o + " " + createBody({ lo: filter.lo, v: filter.v }) + ")";
                } else if (filter.v.length == 1) {
                    return createBody(filter.v.shift());
                }
                return bdy;
            } else if (isSingle(filter)) {
                var o = filter.o;
                if (typeof filter.v == "string") filter.v = "'" + filter.v + "'"
                return "item." + filter.m + " " + o + "  " + filter.v;
            }
        }
        var createFunc = function (filter) {
            var body = createBody(filter);
            var f = new Function("item", " return " + body + ";");
            return f;
        }

        function applyFilter(input, filter) {
            if (filter == undefined) {
                return input;
            }

            var fun = createFunc(filter);
            var output = input.filter(fun);
            return output;
        };
        //m:membre,o:operateur,v:valeur.

        filterSplit = filter.split(";")
        let filterQuery1 = ""
        if (filterSplit.length < 2) {
            filterQuerySplit = filter.split(":")
            filterQuery1 = { m: filterQuerySplit[0].trim(), o: filterQuerySplit[1].trim(), v: filterQuerySplit[2].trim() };
        }
        // exemple : 

        // var filterQuery1 = { m: "time_of_departure", o: ">", v: "22/12/2022" };//simpe query

        // var filterQuery1 = {
        //     lo: "&&", v: [
        //         { m: "time_of_departure", o: ">", v: "21/12/2022" },
        //         { m: "time_of_departure", o: "<", v: "22/12/2022" }]
        // }; //composite query
        train = applyFilter(train, filterQuery1);

    }

    if (!train)
        return res.status(404).json({ error: "Train Not Found" });

    res.status(200).json(train);
}



exports.trainDelete = async (req, res) => {

    let { name } = req.query;

    if (name == undefined)
        return res.status(400).json({ error: "No train id provided" });

    // const id = mongoose.Types.ObjectId(_id);
    try {
        await Train.findOneAndDelete({ name }).then(function (err, docs) {
            if (err) {
               throw new Error("error when deleting train")
            }
            else {
                console.log("Deleted : ", docs);
            }
        });

        res.status(200).send("Train is now delete !");
        
    } catch (error) {
        res.status(500).send("Error when deleting train");

    }


   

  
}
