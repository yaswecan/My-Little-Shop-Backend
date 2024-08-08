const Joi = require("joi");

module.exports.addValidations = brand => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Brand name is not allowed to be empty!',
            'any.required': 'Please enter brand name!',
            'string.base': "Brand name must be a string!"
        })
    });
    return schema.validate(brand);
};