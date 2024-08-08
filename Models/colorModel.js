const {Schema, model} = require("mongoose");

module.exports.Color = model('Color', Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true}))