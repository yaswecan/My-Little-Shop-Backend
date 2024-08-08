//Models
const {Category} = require("../Models/categoryModel");

module.exports.batchCategory = async (categoryIds) => {
    const subcategory = await Category.find({_id: {$in: categoryIds}});
    return categoryIds.map(categoryId => subcategory.find(category => category.id === categoryId));
}