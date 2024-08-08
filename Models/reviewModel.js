const {Schema, model} = require("mongoose");

module.exports.Review = model('Review', Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {timestamps: true}))