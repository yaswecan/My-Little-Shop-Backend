const {GraphQLUpload} = require("graphql-upload");
const {GraphQLDateTime} = require("graphql-iso-date");
//Resolvers
const userResolvers = require("../userResolver");
const categoryResolvers = require("../categoryResolver");
const brandResolvers = require("../brandResolver");
const colorResolvers = require("../colorResolver");
const tagResolvers = require("../tagResolver");
const productResolvers = require("../productResolver");
const wishlistResolvers = require("../wishlistResolvers");
const shippingResolvers = require("../shippingResolver");
const checkoutResolvers = require("../checkoutResolver");
const sellerResolvers = require("../sellerResolver");
const cartResolvers = require("../cartResolver");
const couponResolvers = require("../couponResolver");
const reviewsResolvers = require("../reviewResolver");
const returnResolvers = require("../returnResolver");

const customResolvers = {
    Date: GraphQLDateTime,
    Upload: GraphQLUpload
}

module.exports = [
    customResolvers,
    userResolvers,
    categoryResolvers,
    brandResolvers,
    colorResolvers,
    tagResolvers,
    productResolvers,
    wishlistResolvers,
    shippingResolvers,
    sellerResolvers,
    cartResolvers,
    checkoutResolvers,
    couponResolvers,
    reviewsResolvers,
    returnResolvers
]