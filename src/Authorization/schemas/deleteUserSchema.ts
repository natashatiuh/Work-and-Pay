const Joi = require('joi')

export const deleteUserSchema = Joi.object({
    password: Joi.string().required()
})