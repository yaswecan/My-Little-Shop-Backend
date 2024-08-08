const Joi = require("joi");

module.exports.addValidations = coupon => {
    const schema = Joi.object({
        code: Joi.string().required().messages({
            'string.empty': 'Coupon Code is not allowed to be empty!',
            'any.required': 'Please enter Coupon Code!',
            'string.base': "Coupon Code must be a string!"
        }),
        discount: Joi.number().required().max(100).messages({
            'string.empty': 'Discount is not allowed to be empty!',
            'any.required': 'Please enter Discount!',
            'number.base': "Discount must be a string!",
            'number.max': "Discount must be less than or equal to 100"
        }),
        expiresDate: Joi.string().required().messages({
            'string.empty': 'Expire Date is not allowed to be empty!',
            'any.required': 'Please enter Expire Date!',
            'string.base': "Expire Date must be a string!"
        })
    });
    return schema.validate(coupon);
};