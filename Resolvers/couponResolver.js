//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Coupon} = require("../Models/couponModel");
const {Cart} = require("../Models/cartModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations} = require("../Validations/couponValidations");

module.exports = {
    Query: {
        getCoupons: combineResolvers(isAuthenticated, isAdmin, async () => {
            const coupon = await Coupon.find();
            if (coupon.length === 0) throw new Error("Coupon list is empty!");
            return coupon
        }),
        applyCoupon: combineResolvers(isAuthenticated, async (_, {code}, {reqUserInfo}) => {
            const coupon = await Coupon.findOne({
                code: code
            });
            if (!coupon) throw new Error("Please enter a valid coupon!");
            const hasApplied = await Cart.exists({
                coupon: coupon._id
            });
            if (hasApplied) throw new Error("Coupon already applied!");
            const CurrentDate = new Date();
            const expiresDate = new Date(coupon.expiresDate);
            if (expiresDate < CurrentDate) throw new Error("Date is over!");
            const cart = await Cart.findOne({
                user: reqUserInfo._id
            });
            if (!cart || cart.subtotal === 0) throw new Error("Please add some product to your cart!");
            const discountedPrice = (cart.subtotal - (cart.subtotal * (coupon.discount / 100)));
            cart.discountedPrice = discountedPrice
            cart.coupon = coupon._id
            await cart.save();
            return {
                message: `You get ${coupon.discount}% discount!`
            }
        })
    },
    Mutation: {
        addCoupon: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const coupon = await Coupon.findOne({
                code: input.code
            });
            if (coupon) throw new Error("Coupon exits!");
            const newCoupon = new Coupon(input);
            await newCoupon.save();
            return {
                message: "Coupon added successfully!"
            }
        }),
        updateCoupon: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const coupon = await Coupon.findOne({
                code: input?.code
            });
            if (coupon) throw new Error("Coupon already listed!")
            const result = await Coupon.findByIdAndUpdate(id, {...input}, {new: true});
            if (!result) throw new Error("Coupon not found!");
            return {
                message: "Coupon updated successfully!"
            }
        }),
        deletedCoupon: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Coupon.findByIdAndDelete(id);
            if (!result) throw new Error("Coupon not found!");
            return {
                message: "Coupon deleted successfully!"
            }
        })
    }
}