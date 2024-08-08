//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Review} = require("../Models/reviewModel");
const {Order} = require("../Models/ordersModel");
const {Seller} = require("../Models/sellerModel");
const {Product} = require("../Models/productModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations} = require("../Validations/reviewValidations");

module.exports = {
    Query: {
        getReviews: combineResolvers(isAuthenticated, isAdmin, async () => {
            const review = await Review.find();
            if (review.length === 0) throw new Error("Review list is empty!");
            return review;
        }),
        getReview: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const review = await Review.findOne({
                _id: id
            });
            if (!review) throw new Error("Review not found!");
            return review;
        }),
        getReviewsByProduct: async (_, {product}) => {
            const review = await Review.find({
                product: product
            });
            if (review.length === 0) throw new Error("No Review yet!");
            return review
        },
        reviewAvailability: combineResolvers(isAuthenticated, async (_, {product}, {reqUserInfo}) => {
            const review = await Review.findOne({
                product: product,
                user: reqUserInfo._id
            });
            if (review) {
                return {
                    available: false
                }
            }
            const order = await Order.exists({
                products: {
                    $elemMatch: {
                        product: product
                    }
                },
                user: reqUserInfo._id
            })
            if (!order) {
                return {
                    available: false
                }
            }
            return {
                available: true
            }
        }),
        reviewSummery: async (_, {product}) => {
            const review = await Review.find({
                product: product
            });
            const average = review.reduce((acc, curr) => (++acc[curr.rating - 1], acc),
                Array(5).fill(0));
            const oneStar = (average[0] / review.length) * 100
            const twoStar = (average[1] / review.length) * 100
            const threeStar = (average[2] / review.length) * 100
            const fourStar = (average[3] / review.length) * 100
            const fiveStar = (average[4] / review.length) * 100
            return {
                oneStar: review.length === 0 ? 0 : oneStar,
                twoStar: review.length === 0 ? 0 : twoStar,
                threeStar: review.length === 0 ? 0 : threeStar,
                fourStar: review.length === 0 ? 0 : fourStar,
                fiveStar: review.length === 0 ? 0 : fiveStar,
            }

        }
    },
    Mutation: {
        addReview: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const review = await Review.findOne({
                product: input.product,
                user: reqUserInfo._id
            });
            if (review) throw new Error("You already place a review!");
            const order = await Order.exists({
                products: {
                    $elemMatch: {
                        product: input.product
                    }
                },
                user: reqUserInfo._id
            })
            if (!order) throw new Error("Please buy this product to place a review!");
            const newReview = new Review({...input, user: reqUserInfo._id});
            await newReview.save();
            const allReview = await Review.find({
                product: input.product
            });
            const product = await Product.findOne({
                _id: input.product
            });
            product.rating = allReview.reduce((acc, item) => item.rating + acc, 0) / allReview.length
            product.reviews = allReview.length
            const result = await product.save();
            const seller = await Seller.findOne({
                user: result.seller
            })
            const allProducts = await Product.find({
                seller: seller.user
            })
            seller.rating = (allProducts.reduce((acc, item) => {
                if (item.rating) {
                    acc += item.rating;
                }
                return acc;
            }, 0) / allProducts.length).toFixed(2)
            seller.reviews = allProducts.reduce((acc, item) => {
                if (item.reviews) {
                    acc += item.reviews;
                }
                return acc;
            }, 0);
            await seller.save();
            return {
                message: "Review placed successfully!"
            }
        }),
        updateReview: combineResolvers(isAuthenticated, async (_, {input, id}, {reqUserInfo}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const review = await Review.findByIdAndUpdate(id, {...input}, {new: true});
            if (!review) throw new Error("Review not found!");
            if (input.rating) {
                const allReview = await Review.find({
                    product: review.product
                });
                const product = await Product.findOne({
                    _id: review.product
                });
                product.rating = allReview.reduce((acc, item) => item.rating + acc, 0) / allReview.length
                const result = await product.save();
                const seller = await Seller.findOne({
                    user: result.seller
                })
                const allProducts = await Product.find({
                    seller: seller.user
                })
                seller.rating = (allProducts.reduce((acc, item) => {
                    if (item.rating) {
                        acc += item.rating;
                    }
                    return acc;
                }, 0) / allProducts.length).toFixed(2)
                await seller.save();
            }
            return {
                message: "Review updated successful!"
            }
        })
    },
    Reviews: {
        product: async (parent, _, {loaders}) => {
            const product = await loaders.product.load(parent.product.toString());
            return product;
        },
        user: async (parent, _, {loaders}) => {
            const user = await loaders.user.load(parent.user.toString());
            return user;
        }
    }
}