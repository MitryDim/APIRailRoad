const Joi = require('joi');

exports.validateInputCreate = (req,res,next) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(255)
            .required(),

        start_station: Joi.string()
            .min(8)
            .max(255)
            .required(),

        end_station: Joi.string()
            .min(8)
            .max(255)
            .required(),

        time_of_departure: Joi.date().default(() => moment().format, 'date created')
    })
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};

exports.validateInputUpdate = (req,res,next) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(255)
            .required(),

        start_station: Joi.string()
            .min(8)
            .max(255)
            .required(),

        end_station: Joi.string()
            .min(8)
            .max(255)
            .required(),

        time_of_departure: Joi.date().default(() => moment().format, 'date update')
    })
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};