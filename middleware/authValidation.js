const Joi = require('joi')

// Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(5).required(),
        profileURL: Joi.string(),
    })
    return schema.validate(data)
}

// Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().min(5).required(),
        rememberMeToken: Joi.boolean()
    })
    return schema.validate(data)
}

module.exports.loginValidation = loginValidation
module.exports.registerValidation = registerValidation