const Joi = require('joi');

export const getUserReviewsSchema = Joi.object({
    userId: Joi.string().required()
})