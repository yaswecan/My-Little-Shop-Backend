const Joi = require("joi");

module.exports.addValidations = category => {
    const schema = Joi.object({
        product: Joi.string().required().messages({
            'string.empty': 'Product is not allowed to be empty!',
            'any.required': 'Please enter Product!',
            'string.base': "Product must be a string!"
        }),
        rating: Joi.number().required().max(5).messages({
            'string.empty': 'Rating is not allowed to be empty!',
            'any.required': 'Please enter Rating!',
            'number.base': "Rating must be a string!",
            'number.max': "Rating must be less than or equal to 5"
        }),
        comment: Joi.string().required().messages({
            'string.empty': 'Comment is not allowed to be empty!',
            'any.required': 'Please enter Comment!',
            'string.base': "Comment must be a string!"
        }),
    });
    return schema.validate(category);
};