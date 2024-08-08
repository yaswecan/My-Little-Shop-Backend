//Models
const {Coupon} = require("../Models/couponModel");

module.exports.batchCoupon = async (couponIds) => {
    const coupons = await Coupon.find({_id: {$in: couponIds}});
    return couponIds.map(couponId => coupons.find(coupon => coupon.id === couponId));
}