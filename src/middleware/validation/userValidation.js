const Joi = require('joi');
const PasswordComplexity  = require("joi-password-complexity");
Joi.objectId = require('joi-objectid')(Joi)

exports.validateInputRegister = (req,res,next) => {
    const schema = Joi.object({ 
        pseudo: Joi.string()
                   .min(3)
                   .max(30)
                   .required(),   
                                   
        email: Joi.string()
                  .email()
                  .min(5)
                  .max(255)
                  .required(),

        password: new PasswordComplexity({
          min: 6,
          max: 25,
          lowerCase: 1,
          upperCase: 1,
          numeric: 1,
          symbol: 1,
          requirementCount: 4
        }),

        role: Joi.string()
                 .valid('normal')
                 .valid('employee')
                 .valid('admin')
                 .optional()
    });
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);  
    
    next();     
};

exports.validateInputLogin = (req,res,next) => {
    const schema = Joi.object({                          
        email: Joi.string()
                  .email()
                  .min(5)
                  .max(255)
                  .required(),

        password: new PasswordComplexity({
          min: 6,
          max: 25,
          lowerCase: 1,
          upperCase: 1,
          numeric: 1,
          symbol: 1,
          requirementCount: 4
        })
    });
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);  
    
    next();     
};

exports.validateInputUpdate = (req,res,next) => {
    const schema = Joi.object({
        _id : Joi.objectId().optional(),  

        pseudo: Joi.string()
                   .min(3)
                   .max(30),

        email: Joi.string()
                  .email()
                  .min(5)
                  .max(255),

        password: new PasswordComplexity({
          min: 6,
          max: 25,
          lowerCase: 1,
          upperCase: 1,
          numeric: 1,
          symbol: 1,
          requirementCount: 4
        }),       
        role: Joi.string()
                 .valid('normal')
                 .valid('employee')
                 .valid('admin')
                 .optional()
    });
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);  
    
    next();     
};