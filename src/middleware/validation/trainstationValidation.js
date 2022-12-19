const Joi = require('joi');

exports.validateInputCreate = (req,res,next) => {
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(255)
            .required(),

        open_hour: Joi.date().default(() => moment().format, 'open hour created'),

        close_hour: Joi.date().default(() => moment().format, 'close hour created'),
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

            open_hour: Joi.date().default(() => moment().format, 'open hour update'),

            close_hour: Joi.date().default(() => moment().format, 'close hour update'),
    })
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};