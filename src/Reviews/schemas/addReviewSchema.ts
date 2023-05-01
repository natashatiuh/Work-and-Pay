const Joi = require('joi');

export const addReviewSchema = Joi.object({
    userId: Joi.string().required(),
    mark: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
})