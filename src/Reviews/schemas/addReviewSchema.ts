const Joi = require('joi');

export const addReviewSchema = Joi.object({
    orderId: Joi.string().required(),
    executorId: Joi.string().required(),
    mark: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
})