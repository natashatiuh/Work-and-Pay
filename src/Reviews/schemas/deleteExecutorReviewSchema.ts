const Joi = require('joi');

export const deleteExecutorsReviewSchema = Joi.object({
    reviewId: Joi.string().required()
})