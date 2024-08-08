const {Schema, model} = require("mongoose");

module.exports.Wishlist = model('Wishlist', Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true}))