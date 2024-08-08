const {Schema, model} = require("mongoose");

module.exports.Tag = model('Tag', Schema({
    name: {
        type: String,
        required: true
    }
}, {timestamps: true}))