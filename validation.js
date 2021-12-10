// Validation
const Joi = require('joi');
// id, firstName, lastName, username, email, password, languagePreference, verified, token

const registerValidation = (data) => {

    const schema = Joi.object({
        firstName: Joi.string()
            .min(3)
            .max(255)
            .required(),
    
        lastName: Joi.string()
            .min(3)
            .max(255)
            .required(),

        username: Joi.string()
            .min(3)
            .max(255)
            .required(),
        
        email: Joi.string()
            .min(8)
            .required()
            .email(),
            // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        
        password: Joi.string()
            .min(6)
            .required(),

        confPassword: Joi.string()
            .min(6)
            .required()
            .valid(Joi.ref('password')),
            // .pattern(new RegExp('^[a-zA-Z0-9]{6,1024}$')),
    });
    // Validate the data before entry to the database
    return schema.validate(data);
}

const loginValidation = (data) => {

    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(255)
            .required(),
        
        password: Joi.string()
            .min(6)
            .required(),
        
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;