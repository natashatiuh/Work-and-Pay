const Joi = require('joi');

export const addOrderSchema = Joi.object({
    orderName: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    price: Joi.number().required()
})