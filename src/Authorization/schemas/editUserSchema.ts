const Joi = require('joi')

export const editUserSchema = Joi.object({
    userName: Joi.string().required(),
    yearOfBirth: Joi.number().required(),
    country: Joi.string().required(),
    city: Joi.string().required()
})