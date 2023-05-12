const Joi = require('joi');

export const sendRequestSchema = Joi.object({
    orderId: Joi.string().required()
})

