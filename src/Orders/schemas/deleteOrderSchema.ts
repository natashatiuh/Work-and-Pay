const Joi = require('joi');

export const deleteOrderSchema = Joi.object({
    orderId: Joi.string().required()
})