//Models
const {Subcategory} = require("../Models/categoryModel");

module.exports.batchSubCategory = async (categoryIds) => {
    const subcategory = await Subcategory.find({_id: {$in: categoryIds}});
    return categoryIds.map(categoryId => subcategory.find(category => category.id === categoryId));
}