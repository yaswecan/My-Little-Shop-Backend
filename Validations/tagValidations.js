const Joi = require("joi");

module.exports.addValidations = tag => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Tag name is not allowed to be empty!',
            'any.required': 'Please enter tag name!',
            'string.base': "Tag name must be a string!"
        })
    });
    return schema.validate(tag);
};