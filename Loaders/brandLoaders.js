//Models
const {Brand} = require("../Models/brandModel");

module.exports.batchBrand = async (brandIds) => {
    const brands = await Brand.find({_id: {$in: brandIds}});
    return brandIds.map(brandId => brands.find(brand => brand.id === brandId));
}