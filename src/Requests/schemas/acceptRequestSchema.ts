const Joi = require('joi');

export const acceptRequestSchema = Joi.object({
    requestId: Joi.string().required()
})