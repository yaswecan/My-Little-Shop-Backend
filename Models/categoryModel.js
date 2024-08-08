const {Schema, model} = require("mongoose");

module.exports.Category = model('Category', Schema({
    name: {
        type: String,
        required: true
    },
    subCategory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }
    ]

}, {timestamps: true}));


module.exports.Subcategory = model('Subcategory', Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, {timestamps: true}))