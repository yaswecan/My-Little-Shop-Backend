const Joi = require("joi");

module.exports.addProductValidation = product => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Name is not allowed to be empty!',
            'any.required': 'Please enter name!',
            'string.base': "Name must be a string!"
        }),
        shortDescription: Joi.string().required().messages({
            'string.empty': 'Short Description is not allowed to be empty!',
            'any.required': 'Please enter Short Description',
            'string.base': "Short Description must be a string!"
        }),
        description: Joi.string().required().messages({
            'string.empty': 'Description is not allowed to be empty!',
            'any.required': 'Please enter Description',
            'string.base': "Description must be a string!"
        }),
        price: Joi.number().required().messages({
            'string.empty': 'Price is not allowed to be empty!',
            'any.required': 'Please enter Price',
            'number.base': "Price must be a number!"
        }),
        originalPrice: Joi.allow(),
        stock: Joi.allow(),
        sizes: Joi.allow(),
        category: Joi.allow(),
        subCategory: Joi.allow(),
        brand: Joi.allow(),
        weight: Joi.allow(),
        dimensions: Joi.allow(),
        boxContent: Joi.allow(),
        warranty: Joi.allow(),
        sku: Joi.allow(),
        suitable: Joi.allow(),
        material: Joi.allow(),
        tags: Joi.allow(),
        packagingAndDelivery: Joi.allow(),
        suggestedUse: Joi.allow(),
        otherInformation: Joi.allow(),
        warnings: Joi.allow(),
        additionalInfo: Joi.allow()
    });
    return schema.validate(product);
}