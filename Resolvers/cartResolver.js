//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Cart} = require("../Models/cartModel");
const {Product} = require("../Models/productModel");
const {Coupon} = require("../Models/couponModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");


module.exports = {
    Query: {
        getCarts: combineResolvers(isAuthenticated, isAdmin, async () => {
            const carts = await Cart.find();
            if (carts.length === 0) throw new Error("Cart not found!");
            return carts;
        }),
        getCartsByUser: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            const carts = await Cart.find({
                user: reqUserInfo._id
            });
            if (carts.length === 0) throw new Error("Cart not found!");
            return carts;
        }),
        getCart: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const cart = await Cart.findOne({
                _id: id
            });
            if (!cart) throw new Error("Cart not found!");
            return cart;
        })
    },
    Mutation: {
        addCart: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const cart = await Cart.findOne({
                user: reqUserInfo._id
            });
            const product = await Product.findOne({
                _id: input.product
            });
            if (!cart) {
                const newCart = new Cart({
                    products: {
                        product: product._id,
                        price: product.price
                    },
                    user: reqUserInfo._id,
                    subtotal: product.price
                });
                await newCart.save();
                return {
                    message: "Cart added successfully!"
                }
            } else {
                const hasProduct = await Cart.findOne({
                    products: {
                        $elemMatch: {
                            product: input.product
                        }
                    },
                    user: reqUserInfo._id
                });
                if (!hasProduct) {
                    cart.products.push({
                        product: input.product,
                        price: product.price
                    });
                    cart.subtotal = cart.products.reduce((acc, item) => {
                        if (item.selected) {
                            acc += item.price;
                        }
                        return acc;
                    }, 0);
                    if (cart.coupon) {
                        const coupon = await Coupon.findOne({
                            _id: cart.coupon
                        });
                        cart.discountedPrice = (cart.subtotal - (cart.subtotal * (coupon.discount / 100)));
                    }
                    await cart.save();
                    return {
                        message: "Cart added successfully!"
                    }
                } else {
                    const result = await Cart.findOneAndUpdate({
                        $and: [
                            {
                                products: {
                                    $elemMatch: {
                                        product: input.product,
                                        quantity: {
                                            $lte: 4
                                        }
                                    }
                                }
                            }
                        ],
                        user: reqUserInfo._id
                    }, {
                        $inc: {
                            "products.$.quantity": 1,
                            "products.$.price": product.price
                        }
                    });
                    if (!result) throw new Error("You can't add more than 5 times a products");
                    const updatedCart = await Cart.findOne({
                        user: reqUserInfo._id
                    })
                    updatedCart.subtotal = updatedCart.products.reduce((acc, item) => {
                        if (item.selected) {
                            acc += item.price;
                        }
                        return acc;
                    }, 0);
                    if (updatedCart.coupon) {
                        const coupon = await Coupon.findOne({
                            _id: updatedCart.coupon
                        });
                        updatedCart.discountedPrice = (updatedCart.subtotal - (updatedCart.subtotal * (coupon.discount / 100)));
                    }
                    await updatedCart.save();
                    return {
                        message: "Cart added successfully!"
                    }
                }
            }
        }),
        updateCart: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const result = await Cart.findOneAndUpdate({
                products: {
                    $elemMatch: {
                        product: input.product
                    }
                },
                user: reqUserInfo._id
            }, {
                $set: {
                    "products.$.selected": input.selected
                }
            });
            if (!result) throw new Error("Cart not found!");
            const updatedCart = await Cart.findOne({
                user: reqUserInfo._id
            })
            updatedCart.subtotal = updatedCart.products.reduce((acc, item) => {
                if (item.selected) {
                    acc += item.price;
                }
                return acc;
            }, 0);
            if (updatedCart.coupon) {
                const coupon = await Coupon.findOne({
                    _id: updatedCart.coupon
                });
                updatedCart.discountedPrice = (updatedCart.subtotal - (updatedCart.subtotal * (coupon.discount / 100)));
            }
            await updatedCart.save();
            return {
                message: "Cart updated successfully!"
            }
        }),
        increaseQuantity: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const product = await Product.findOne({
                _id: input.product
            })
            const result = await Cart.findOneAndUpdate({
                $and: [
                    {
                        products: {
                            $elemMatch: {
                                product: input.product,
                                quantity: {
                                    $lte: 4
                                }
                            }
                        }
                    }
                ],
                user: reqUserInfo._id
            }, {
                $inc: {
                    "products.$.quantity": 1,
                    "products.$.price": product.price
                }
            });
            if (!result) throw new Error("You can't add more than 5 times a products");
            const updatedCart = await Cart.findOne({
                user: reqUserInfo._id
            })
            updatedCart.subtotal = updatedCart.products.reduce((acc, item) => {
                if (item.selected) {
                    acc += item.price;
                }
                return acc;
            }, 0);
            if (updatedCart.coupon) {
                const coupon = await Coupon.findOne({
                    _id: updatedCart.coupon
                });
                updatedCart.discountedPrice = (updatedCart.subtotal - (updatedCart.subtotal * (coupon.discount / 100)));
            }
            await updatedCart.save();
            return {
                message: "Cart updated successfully!"
            }
        }),
        decreaseQuantity: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const product = await Product.findOne({
                _id: input.product
            })
            const result = await Cart.findOneAndUpdate({
                $and: [
                    {
                        products: {
                            $elemMatch: {
                                product: input.product,
                                quantity: {
                                    $gte: 2
                                }
                            }
                        }
                    }
                ],
                user: reqUserInfo._id
            }, {
                $inc: {
                    "products.$.quantity": -1,
                    "products.$.price": -product.price
                }
            });
            if (!result) throw new Error("You can't decrease less than 1 times a products");
            const updatedCart = await Cart.findOne({
                user: reqUserInfo._id
            })
            updatedCart.subtotal = updatedCart.products.reduce((acc, item) => {
                if (item.selected) {
                    acc += item.price;
                }
                return acc;
            }, 0);
            if (updatedCart.coupon) {
                const coupon = await Coupon.findOne({
                    _id: updatedCart.coupon
                });
                updatedCart.discountedPrice = (updatedCart.subtotal - (updatedCart.subtotal * (coupon.discount / 100)));
            }
            await updatedCart.save();
            return {
                message: "Cart updated successfully!"
            }
        }),
        deleteCartProduct: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const cart = await Cart.findOne({
                products: {
                    $elemMatch: {
                        product: input.product
                    }
                },
                user: reqUserInfo._id
            });
            if (!cart) throw new Error("Product not found in your cart!");
            await Cart.updateOne({
                user: reqUserInfo._id
            }, {
                $pull: {
                    products: {
                        product: input.product,
                    }
                }
            });
            const updatedCart = await Cart.findOne({
                user: reqUserInfo._id
            })
            updatedCart.subtotal = updatedCart.products.reduce((acc, item) => {
                if (item.selected) {
                    acc += item.price;
                }
                return acc;
            }, 0);
            if (updatedCart.coupon) {
                const coupon = await Coupon.findOne({
                    _id: updatedCart.coupon
                });
                updatedCart.discountedPrice = (updatedCart.subtotal - (updatedCart.subtotal * (coupon.discount / 100)));
            }
            await updatedCart.save();
            return {
                message: "Cart deleted successfully!"
            }
        })
    },
    Cart: {
        user: async (parent, _, {loaders}) => {
            const user = await loaders.user.load(parent.user.toString());
            return user;
        },
        coupon: async (parent, _, {loaders}) => {
            if (parent.coupon) {
                const coupon = await loaders.coupon.load(parent.coupon.toString());
                return coupon;
            }
        }
    },
    CartProductTypes: {
        product: async (parent, _, {loaders}) => {
            const product = await loaders.product.load(parent.product.toString());
            return product;
        },
    }
}