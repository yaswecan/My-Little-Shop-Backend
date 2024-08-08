const Joi = require("joi");

module.exports.addValidations = seller => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Shop name is not allowed to be empty!',
            'any.required': 'Please enter shop name!',
            'string.base': "Shop name must be a string!"
        }),
        address: Joi.allow(),
        phone: Joi.allow(),
        description: Joi.allow()
    });
    return schema.validate(seller);
};