//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Wishlist} = require("../Models/wishlistModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");

module.exports = {
    Query: {
        isWishListed: combineResolvers(isAuthenticated, async (_, {product}, {reqUserInfo}) => {
            const wishlist = await Wishlist.findOne({
                product: product,
                user: reqUserInfo._id
            })
            if (wishlist) {
                return {
                    isWishListed: true
                }
            } else {
                return {
                    isWishListed: false
                }
            }
        })
    },
    Mutation: {
        addWishlist: combineResolvers(isAuthenticated, async (_, {product}, {reqUserInfo}) => {
            const wishlist = await Wishlist.findOne({
                product: product,
                user: reqUserInfo._id
            })
            if (wishlist) {
                await Wishlist.findByIdAndDelete(wishlist._id);
                return {
                    message: "Wishlist removed successfully!"
                }
            } else {
                const newWishlist = new Wishlist({product, user: reqUserInfo._id});
                await newWishlist.save();
                return {
                    message: "Wishlist added successfully!"
                }
            }
        })
    }
}