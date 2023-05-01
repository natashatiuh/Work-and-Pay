const Joi = require('joi')

export const registrationSchema = Joi.object({
    userName: Joi.string().required(),
    yearOfBirth: Joi.number().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    password: Joi.string().required().min(8)
})