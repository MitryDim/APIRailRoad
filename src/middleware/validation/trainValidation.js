const Joi = require('joi');
const trainStation = require("../../models/trainstationModel")

exports.validateInputCreate = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),

        start_station: Joi.string()
            .min(3)
            .max(255)
            .required(),

        end_station: Joi.string()
            .min(3)
            .max(255)
            .required(),

        time_of_departure: Joi.string()
                                .regex(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/).required()
    })

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { start_station, end_station } = req.body;

    if (start_station == end_station)
        return res.status(400).send("start station and end station must be different")

            
    if (!trainStation.isThisNameInUse(start_station))
        return res.status(400).send("please put an existing start station")

    if (!trainStation.isThisNameInUse(end_station))
        return res.status(400).send("please put an existing end station")

    

    next();
};

exports.validateInputUpdate = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(255)
            .required(),

        start_station: Joi.string()
            .min(3)
            .max(255)
            .required(),

        end_station: Joi.string()
            .min(3)
            .max(255)
            .required(),


        time_of_departure: Joi.string()
                             .regex(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/)
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

 
    next();
};


