const {gql} = require("apollo-server-express");

//TypeDefs
const userTypeDefs = require("../userTypes");
const categoryTypeDefs = require("../categoryTypes");
const brandTypeDefs = require("../brandTypes");
const colorTypeDefs = require("../colorTypes");
const tagTypeDefs = require("../tagTypes");
const productTypeDefs = require("../productTypes");
const wishlistTypeDefs = require("../wishlistTypes");
const shippingTypeDefs = require("../shippingTypes");
const checkoutTypeDefs = require("../checkoutTypes");
const sellerTypeDefs = require("../sellerTypes");
const cartTypeDefs = require("../cartTypes");
const couponTypeDefs = require("../couponTypes");
const reviewsTypeDefs = require("../reviewsTypes");
const returnTypeDefs = require("../returnTypes");

const typeDefs = gql`
    scalar Date
    scalar Upload
    type Query {
        _:String
    }
    type Mutation {
        _:String
    }
`

module.exports = [
    typeDefs,
    userTypeDefs,
    categoryTypeDefs,
    brandTypeDefs,
    colorTypeDefs,
    tagTypeDefs,
    productTypeDefs,
    wishlistTypeDefs,
    shippingTypeDefs,
    sellerTypeDefs,
    cartTypeDefs,
    checkoutTypeDefs,
    couponTypeDefs,
    reviewsTypeDefs,
    returnTypeDefs
]