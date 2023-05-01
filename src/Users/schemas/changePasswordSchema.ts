const Joi = require('joi')

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().min(8),
    newPassword: Joi.string().required().min(8)
})