const Joi = require('joi');

export const deleteAuthorsReviewSchema = Joi.object({
    reviewId: Joi.string().required()
})