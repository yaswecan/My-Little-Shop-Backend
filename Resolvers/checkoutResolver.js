//Packages
const {combineResolvers} = require("graphql-resolvers");
const stripe = require("stripe")(process.env.STRIPE_CLIENT_ID);
//Models
const {Order} = require("../Models/ordersModel");
const {Product} = require("../Models/productModel");
const {Cart} = require("../Models/cartModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
const {isSeller} = require("../Authorization/Seller");
//Validations
const {stripeValidations, paypalValidations} = require("../Validations/checkoutValidations");

module.exports = {
    Query: {
        getOrders: combineResolvers(isAuthenticated, isAdmin, async () => {
            const orders = await Order.find();
            if (orders.length === 0) throw new Error("Order list is empty!");
            return orders
        }),
        getOrdersByUser: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            const orders = await Order.find({
                user: reqUserInfo._id
            });
            if (orders.length === 0) throw new Error("Order list is empty!");
            return orders
        }),
        getOrdersBySeller: combineResolvers(isAuthenticated, isSeller, async (_, __, {reqUserInfo}) => {
            const product = await Product.find({
                seller: reqUserInfo._id
            });
            if (product.length === 0) throw new Error("Upload some product to get order!");
            const order = await Order.find({
                product: {
                    $in: product.map(item => item._id)
                }
            });
            if (order.length === 0) throw new Error("You have no order yet!")
            return order;
        }),
        getOrder: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const order = await Order.findOne({
                _id: id
            })
            if (!order) throw new Error("Order not found!");
            return order;
        }),
        getOrderByUser: combineResolvers(isAuthenticated, async (_, {id}, {reqUserInfo}) => {
            const order = await Order.findOne({
                _id: id,
                user: reqUserInfo._id
            });
            if (!order) throw new Error("Order not found!");
            return order;
        }),
        getOrderBySeller: combineResolvers(isAuthenticated, isSeller, async (_, {id}, {reqUserInfo}) => {
            const product = await Product.find({
                seller: reqUserInfo._id
            });
            if (product.length === 0) throw new Error("Upload some product to get order!");
            const order = await Order.findOne({
                _id: id,
                product: {
                    $in: product.map(item => item._id)
                }
            });
            if (!order) throw new Error("Order not found!");
            return order;
        })
    },
    Mutation: {
        stripePayment: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const {error} = stripeValidations(input);
            if (error) throw new Error(error.details[0].message);
            const carts = await Cart.findOne({
                _id: input.cart,
                user: reqUserInfo._id
            });
            if (!carts || carts.products.length === 0) throw new Error("Please add some product to your cart!")
            const payment = await stripe.paymentIntents.create({
                amount: carts.coupon ? carts.discountedPrice : carts.subtotal,
                currency: "USD",
                description: input.paymentId,
                payment_method: input.paymentId,
                confirm: true,
            })
            if (payment.status !== "succeeded" || !payment) throw new Error("Payment incomplete");
            let products = [];
            carts.products.forEach(cart => {
                if (cart.selected) {
                    products.push({
                        product: cart.product,
                        quantity: cart.quantity,
                        price: cart.price
                    })
                }
            });
            const order = new Order({
                products,
                ...input,
                paymentInfo: {
                    method: "Stripe",
                    paymentId: payment.id
                },
                payedAmount: carts.coupon ? carts.discountedPrice : carts.subtotal,
                user: reqUserInfo._id,
                status: payment.status
            })
            await order.save();
            await Cart.updateOne({
                user: reqUserInfo._id
            }, {
                $pull: {
                    products: {
                        product: {
                            $in: products.map(item => item.product)
                        }
                    }
                }
            });
            const updateCart = await Cart.findOne({
                _id: input.cart,
                user: reqUserInfo._id
            });
            updateCart.discountedPrice = null
            updateCart.coupon = null
            updateCart.subtotal = updateCart.products.reduce((acc, item) => {
                if (item.selected) {
                    acc += item.price;
                }
                return acc;
            }, 0);
            await updateCart.save();
            return {
                message: "Payment successful!"
            }
        }),
        paypalPayment: combineResolvers(isAuthenticated, async (_, {input}, {reqUserInfo}) => {
            const {error} = paypalValidations(input);
            if (error) throw new Error(error.details[0].message);
            const carts = await Cart.findOne({
                _id: input.cart,
                user: reqUserInfo._id
            });
            if (!carts || carts.products.length === 0) throw new Error("Please add some product to your cart!");
            if (carts.coupon) {
                if (carts.discountedPrice !== input.payedAmount) throw new Error("Something went wrong! Please contact our support team to get solutions.");
            } else {
                if (carts.subtotal !== input.subtotal) throw new Error("Something went wrong! Please contact our support team to get solutions.");
            }
            let products = [];
            carts.products.forEach(cart => {
                if (cart.selected) {
                    products.push({
                        product: cart.product,
                        quantity: cart.quantity,
                        price: cart.price
                    })
                }
            });
            const order = new Order({
                products,
                ...input,
                paymentInfo: {
                    method: "Paypal",
                    paymentId: input.paymentId
                },
                user: reqUserInfo._id,
                status: "succeeded"
            })
            await order.save();
            await Cart.updateOne({
                user: reqUserInfo._id
            }, {
                $pull: {
                    products: {
                        product: {
                            $in: products.map(item => item.product)
                        }
                    }
                }
            });
            const updateCart = await Cart.findOne({
                _id: input.cart,
                user: reqUserInfo._id
            });
            updateCart.discountedPrice = null
            updateCart.coupon = null
            updateCart.subtotal = updateCart.products.reduce((acc, item) => {
                if (item.selected) {
                    acc += item.price;
                }
                return acc;
            }, 0);
            await updateCart.save();
            return {
                message: "Payment successful!"
            }
        })
    },
    Orders: {
        shippingMethod: async (parent, _, {loaders}) => {
            const shipping = await loaders.shipping.load(parent.shippingMethod.toString());
            return shipping;
        },
        user: async (parent, _, {loaders}) => {
            const user = await loaders.user.load(parent.user.toString());
            return user;
        }
    },
    ProductsTypes: {
        product: async (parent, _, {loaders}) => {
            const product = await loaders.product.load(parent.product.toString());
            return product;
        },
    }
}