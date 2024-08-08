const {Schema, model} = require("mongoose");

module.exports.Shipping = model('Shipping', Schema({
    title: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    }
}, {timestamps: true}))