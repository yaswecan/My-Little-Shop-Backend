const {Schema, model} = require("mongoose");

module.exports.Seller = model('Seller', Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accept: {
        type: Boolean,
        default: false
    },
    shopImage: String,
    imageId: String,
    address: {
        type: String,
        required: true
    },
    phone: String,
    description: String,
    rating: Number,
    reviews: Number,
    shipTime: Number,
    chatResponse: Number,
}, {timestamps: true}))