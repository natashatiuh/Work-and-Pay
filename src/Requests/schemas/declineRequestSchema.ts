const Joi = require('joi');

export const declineRequestSchema = Joi.object({
    requestId: Joi.string().required()
})