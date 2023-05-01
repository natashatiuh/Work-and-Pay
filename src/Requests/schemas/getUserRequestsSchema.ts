const Joi = require('joi');

export const getUserRequestsSchema = Joi.object({
    userId: Joi.string().required()
})