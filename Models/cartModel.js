const {Schema, model} = require("mongoose");

module.exports.Cart = model('Cart', Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1,
                max: 5
            },
            price: Number,
            selected: {
                type: Boolean,
                default: true
            },
            _id: false
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    subtotal: {
        type: Number,
        required: true
    },
    discountedPrice: Number,
    coupon: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon'
    }
}, {timestamps: true}));