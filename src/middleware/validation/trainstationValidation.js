const Joi = require('joi');



exports.validateInputCreate = (req, res, next) => {

    let newImage = Buffer.alloc(0);
    if (req.file) {
        newImage = req.file.buffer
    }

    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(255)
            .required(),

        open_hour: Joi.string()
            .regex(/^(\d{2}):(\d{2})$/)
            .required(),

        close_hour: Joi.string()
            .regex(/^(\d{2}):(\d{2})$/)
            .required(),

        image: Joi.binary().min(1).required()
    })
    let data = { image: newImage, ...req.body };
    const { error } = schema.validate(data)

    if (error) return res.status(400).send(error.details[0].message);

    next();
};

exports.validateInputUpdate = (req, res, next) => {
    let newImage = null;
    if (req.file) {
        newImage = req.file.buffer
    }
    const schema = Joi.object({
        name: Joi.string()
            .min(6)
            .max(255)
            .required(),

        open_hour: Joi.string()
            .regex(/^(\d{2}):(\d{2})$/)
            .required(),

        close_hour: Joi.string()
            .regex(/^(\d{2}):(\d{2})$/)
            .required(),

        image: Joi.binary().optional()

    })

    let data = { image: newImage, ...req.body };
    const { error } = schema.validate(data);

    if (error) return res.status(400).send(error.details[0].message);

    next();
};