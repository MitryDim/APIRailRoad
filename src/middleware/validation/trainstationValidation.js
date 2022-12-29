const Joi = require('joi');



exports.validateInputCreate = (req, res, next) => {

    let newImage = null;
if(req.file && req.file.path) {
        newImage = req.file.path.replace(/\\/g, "/");
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

        image: Joi.string().required()
    })  
    let data = {image: newImage,...req.body};
    

    const { error } = schema.validate(data)   // schema.validate(req);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};

exports.validateInputUpdate = (req, res, next) => {
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
        
        image: Joi.string().min(0)

    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
};