const Joi = require("joi");

module.exports.addValidations = color => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Color name is not allowed to be empty!',
            'any.required': 'Please enter color name!',
            'string.base': "Color name must be a string!"
        })
    });
    return schema.validate(color);
};