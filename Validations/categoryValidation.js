const Joi = require("joi");

module.exports.addValidations = category => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Category name is not allowed to be empty!',
            'any.required': 'Please enter Category name!',
            'string.base': "Category name must be a string!"
        })
    });
    return schema.validate(category);
};

module.exports.addSubValidations = sub => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Category name is not allowed to be empty!',
            'any.required': 'Please enter Category name!',
            'string.base': "Category name must be a string!"
        }),
        category: Joi.string().required().messages({
            'string.empty': 'Category Id is not allowed to be empty!',
            'any.required': 'Please enter Category Id!',
            'string.base': "Category Id must be a string!"
        })
    });
    return schema.validate(sub);
}