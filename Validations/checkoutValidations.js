const Joi = require("joi");

module.exports.stripeValidations = payment => {
    const schema = Joi.object({
        cart: Joi.string().required().messages({
            'string.empty': 'Cart Id is not allowed to be empty!',
            'any.required': 'Please enter Cart Id!',
            'string.base': "Cart Id must be a string!"
        }),
        paymentId: Joi.string().required().messages({
            'string.empty': 'Payment Id is not allowed to be empty!',
            'any.required': 'Please enter Payment Id!',
            'string.base': "Payment Id must be a string!"
        }),
        shippingMethod: Joi.string().required().messages({
            'string.empty': 'Shipping method is not allowed to be empty!',
            'any.required': 'Please enter Shipping method!',
            'string.base': "Shipping method must be a string!"
        }),
        firstName: Joi.allow(),
        lastName: Joi.allow(),
        country: Joi.allow(),
        address: Joi.string().required().messages({
            'string.empty': 'Address is not allowed to be empty!',
            'any.required': 'Please enter Address!',
            'string.base': "Address must be a string!"
        }),
        city: Joi.string().required().messages({
            'string.empty': 'City is not allowed to be empty!',
            'any.required': 'Please enter City!',
            'string.base': "City must be a string!"
        }),
        zip: Joi.string().required().messages({
            'string.empty': 'Zip is not allowed to be empty!',
            'any.required': 'Please enter Zip!',
            'string.base': "Zip must be a string!"
        }),
        email: Joi.string().required().email().messages({
            'string.empty': 'Email is not allowed to be empty!',
            'any.required': 'Please enter Email!',
            'string.base': "Email must be a string!",
            'string.email': "Email must be a valid email!",
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Lastname is not allowed to be empty!',
            'any.required': 'Please enter Lastname!',
            'string.base': "Lastname must be a string!"
        }),
        saveData: Joi.allow()
    });
    return schema.validate(payment);
};

module.exports.paypalValidations = payment => {
    const schema = Joi.object({
        cart: Joi.string().required().messages({
            'string.empty': 'Cart Id is not allowed to be empty!',
            'any.required': 'Please enter Cart Id!',
            'string.base': "Cart Id must be a string!"
        }),
        payedAmount: Joi.number().required().messages({
            'string.empty': 'Payed Amount is not allowed to be empty!',
            'any.required': 'Please enter Payed Amount!',
            'number.base': "Payed Amount must be a string!"
        }),
        paymentId: Joi.string().required().messages({
            'string.empty': 'Payment Id is not allowed to be empty!',
            'any.required': 'Please enter Payment Id!',
            'string.base': "Payment Id must be a string!"
        }),
        shippingMethod: Joi.string().required().messages({
            'string.empty': 'Shipping method is not allowed to be empty!',
            'any.required': 'Please enter Shipping method!',
            'string.base': "Shipping method must be a string!"
        }),
        firstName: Joi.allow(),
        lastName: Joi.allow(),
        country: Joi.allow(),
        address: Joi.string().required().messages({
            'string.empty': 'Address is not allowed to be empty!',
            'any.required': 'Please enter Address!',
            'string.base': "Address must be a string!"
        }),
        city: Joi.string().required().messages({
            'string.empty': 'City is not allowed to be empty!',
            'any.required': 'Please enter City!',
            'string.base': "City must be a string!"
        }),
        zip: Joi.string().required().messages({
            'string.empty': 'Zip is not allowed to be empty!',
            'any.required': 'Please enter Zip!',
            'string.base': "Zip must be a string!"
        }),
        email: Joi.string().required().email().messages({
            'string.empty': 'Email is not allowed to be empty!',
            'any.required': 'Please enter Email!',
            'string.base': "Email must be a string!",
            'string.email': "Email must be a valid email!",
        }),
        phone: Joi.string().required().messages({
            'string.empty': 'Lastname is not allowed to be empty!',
            'any.required': 'Please enter Lastname!',
            'string.base': "Lastname must be a string!"
        }),
        saveData: Joi.allow()
    });
    return schema.validate(payment);
};