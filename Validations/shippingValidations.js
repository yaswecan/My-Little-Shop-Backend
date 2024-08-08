const Joi = require("joi");

module.exports.addValidations = shipping => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Title is not allowed to be empty!',
            'any.required': 'Please enter title name!',
            'string.base': "Title name must be a string!"
        }),
        deliveryTime: Joi.string().required().messages({
            'string.empty': 'Delivery time is not allowed to be empty!',
            'any.required': 'Please enter delivery time!',
            'string.base': "Delivery time must be a string!"
        }),
        fees: Joi.number().required().messages({
            'string.empty': 'Fees is not allowed to be empty!',
            'any.required': 'Please enter fees!',
            'number.base': "Fees must be a number!"
        })
    });
    return schema.validate(shipping);
};