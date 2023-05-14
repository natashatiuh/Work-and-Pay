const Joi = require('joi');

export const addReviewToAuthorSchema = Joi.object({
    orderId: Joi.string().required(),
    authorsId: Joi.string().required(),
    mark: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
})