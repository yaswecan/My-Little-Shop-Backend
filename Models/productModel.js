const {Schema, model} = require("mongoose");

module.exports.Product = model('Product', Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            _id: false,
            url: {type: String, required: true},
            color: {
                type: Schema.Types.ObjectId,
                ref: 'Color',
                required: true
            },
            imageId: String
        }
    ],
    price: {
        type: Number,
        trim: true,
        required: true
    },
    originalPrice: Number,
    discount: Number,
    rating: Number,
    reviews: Number,
    stock: Number,
    sizes: [
        {
            _id: false,
            size: String
        }
    ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategory'
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    weight: String,
    dimensions: {
        width: String,
        height: String,
        length: String,
    },
    boxContent: String,
    warranty: {
        type: {type: String},
        period: String,
        policy: String
    },
    sku: String,
    suitable: [
        {_id: false, name: String}
    ],
    material: String,
    tags: [
        {
            _id: false,
            name: {
                type: Schema.Types.ObjectId,
                ref: 'Tag'
            }
        }
    ],
    packagingAndDelivery: String,
    suggestedUse: String,
    otherInformation: String,
    warnings: String,
    additionalInfo: [
        {_id: false, field: String, value: String}
    ],
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true}));