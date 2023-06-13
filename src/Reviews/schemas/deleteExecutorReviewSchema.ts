const Joi = require('joi');

export const deleteReviewSchema = Joi.object({
    reviewId: Joi.string().required()
})