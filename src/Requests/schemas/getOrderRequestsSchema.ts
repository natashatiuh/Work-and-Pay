const Joi = require('joi');

export const getOrderRequestsSchema = Joi.object({
    orderId: Joi.string().required()
})