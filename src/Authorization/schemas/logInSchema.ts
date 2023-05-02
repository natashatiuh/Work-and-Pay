const Joi = require('joi')

export const logInSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(8)
})