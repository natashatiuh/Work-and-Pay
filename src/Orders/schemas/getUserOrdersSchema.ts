const Joi = require('joi');

export const getUserOrdersSchema = Joi.object({
    userId: Joi.string().required()
})