const Joi = require('joi')

export const deleteUserSchema = Joi.object({
    userId: Joi.string().required(),
    password: Joi.string().required()
})