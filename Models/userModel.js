const {Schema, model} = require("mongoose");
const jwt = require("jsonwebtoken");
//StringBase
const {stringToBase64} = require("../Middlewares/base");

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: String,
    password: {
        type: String,
        select: false
    },
    avatar: String,
    avatarId: String,
    provider: String,
    googleId: String,
    facebookId: String,
    verified: Boolean,
    address: String,
    country: String,
    city: String,
    zipCode: String,
    role: {
        type: String,
        enum: ['user', 'seller', 'admin', 'superAdmin'],
        default: 'user'
    }
}, {timestamps: true});
// JSON web token creations
userSchema.methods.generateJWT = function () {
    const token = jwt.sign({
        info: stringToBase64(this.email),
    }, process.env.JWT_SECRET_KEY, {expiresIn: "30d"});
    return token;
};

module.exports.User = model('User', userSchema);