const Joi = require('joi');

export const editOrderSchema = Joi.object({
    orderName: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    price: Joi.number().required(),
    orderId: Joi.string().required()
})