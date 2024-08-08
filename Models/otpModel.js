const { Schema, model } = require("mongoose");

module.exports.Otp = model('Otp', Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: String,
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } }
}, { timestamps: true }))