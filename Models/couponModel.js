const {Schema, model} = require("mongoose");

module.exports.Coupon = model('Coupon', Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        max: 100
    },
    discountUnit: {
        type: String,
        default: "%"
    },
    expiresDate: {
        type: String
    }
}, {timestamps: true}))