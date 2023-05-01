const Joi = require('joi');

export const cancelRequestSchema = Joi.object({
    requestId: Joi.string().required()
})