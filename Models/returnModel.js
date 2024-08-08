const {Schema, model} = require("mongoose");

module.exports.Return = model('Return', Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: Number,
            _id: false
        }
    ],
    reason: {
        type: String,
        required: true
    },
    file: String,
    accept: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true}))