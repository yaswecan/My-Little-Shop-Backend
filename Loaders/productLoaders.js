//Models
const {Product} = require("../Models/productModel");

module.exports.batchProduct = async (productIds) => {
    const products = await Product.find({_id: {$in: productIds}});
    return productIds.map(productId => products.find(product => product.id === productId));
}