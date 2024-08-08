const {Schema, model} = require("mongoose");

module.exports.Brand = model('Brand', Schema({
    name: {
        type: String,
        require: true
    }
}, {timestamps: true}))