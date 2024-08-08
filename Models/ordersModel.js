const {Schema, model} = require("mongoose");

module.exports.Order = model('Order', Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: Number,
            price: Number,
            _id: false
        }
    ],
    items: {
        type: Number,
        trim: true
    },
    payedAmount: {
        type: Number,
        trim: true,
        required: true
    },
    paymentInfo: {
        method: String,
        paymentId: {
            type: String,
            required: true
        }
    },
    shippingMethod: {
        type: Schema.Types.ObjectId,
        ref: 'Shipping',
        required: true
    },
    firstName: String,
    lastName: String,
    country: String,
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: String,
    saveData: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true}));