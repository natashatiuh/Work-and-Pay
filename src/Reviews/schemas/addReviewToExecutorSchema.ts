const Joi = require('joi');

export const addReviewToExecutorSchema = Joi.object({
    orderId: Joi.string().required(),
    recipientId: Joi.string().required(),
    mark: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
})