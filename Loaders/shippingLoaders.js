//Models
const {Shipping} = require("../Models/shippingModel");

module.exports.batchShipping = async (shippingIds) => {
    const shippings = await Shipping.find({_id: {$in: shippingIds}});
    return shippingIds.map(shippingId => shippings.find(shipping => shipping.id === shippingId));
}