const Joi = require('joi')

export const editUserSchema = Joi.object({
    userId: Joi.string().required(),
    userName: Joi.string().required(),
    yearOfBirth: Joi.number().required(),
    country: Joi.string().required(),
    city: Joi.string().required()
})