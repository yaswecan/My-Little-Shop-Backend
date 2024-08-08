//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Category, Subcategory} = require("../Models/categoryModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations, addSubValidations} = require("../Validations/categoryValidation");


module.exports = {
    Query: {
        getCategories: async () => {
            const category = await Category.find();
            if (category.length === 0) throw new Error("Category list is empty!");
            return category;
        },
        getCategory: async (_, {id}) => {
            const category = await Category.findOne({
                _id: id
            });
            if (!category) throw new Error("Category not found!");
            return category;
        },
        getSubCategories: async () => {
            const subcategory = await Subcategory.find();
            if (!subcategory) throw new Error("Sub Category not found!");
            return subcategory;
        },
        getSubCategory: async (_, {id}) => {
            const subcategory = await Subcategory.findOne({
                _id: id
            });
            if (!subcategory) throw new Error("Sub category not found!");
            return subcategory
        }
    },
    Mutation: {
        addCategory: combineResolvers(isAuthenticated, isAdmin, async (_, {name}) => {
            const {error} = addValidations({name});
            if (error) throw  new Error(error.details[0].message);
            const category = await Category.findOne({
                name: name
            });
            if (category) throw new Error("Category already created!");
            const newCategory = new Category({name})
            await newCategory.save();
            return {
                message: "Category created successfully!"
            }
        }),
        addSubCategory: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = addSubValidations(input);
            if (error) throw new Error(error.details[0].message);
            const subCategory = await Subcategory.findOne({
                name: input.name,
                category: input.category
            });
            if (subCategory) throw new Error("Category already created!");
            const newSubCategory = new Subcategory({...input});
            const result = await newSubCategory.save();
            const category = await Category.findOne({
                _id: input.category
            });
            category.subCategory.push(result._id);
            await category.save();
            return {
                message: "Sub Category created successfully!"
            }
        }),
        updateCategory: combineResolvers(isAuthenticated, isAdmin, async (_, {name, id}) => {
            if (name) {
                const category = await Category.findByIdAndUpdate(id, {
                    name
                }, {new: true});
                if (!category) throw new Error("Category not found");
            }
            return {
                message: "Category updated successfully!"
            }
        }),
        updateSubCategory: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const subCategory = await Subcategory.findOne({
                _id: id
            });
            if (!subCategory) throw new Error("Sub Category not found!");
            await Subcategory.findByIdAndUpdate(id, {...input}, {new: true});
            if (input.category) {
                const oldCategory = await Category.findOne({
                    _id: subCategory.category
                })
                oldCategory.subCategory.pull(subCategory._id);
                await oldCategory.save();
                const newCategory = await Category.findOne({
                    _id: input.category
                });
                newCategory.subCategory.push(subCategory._id);
                await newCategory.save();
            }

            return {
                message: "Category updated successfully!"
            }
        }),
        deleteCategory: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Category.findByIdAndDelete(id);
            if (!result) throw  new Error("Category not found");
            return {
                message: "Category deleted successfully!"
            }
        }),
        deleteSubCategory: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Subcategory.findByIdAndDelete(id);
            if (!result) throw new Error("Category not found!");
            const category = await Category.findOne({
                _id: result.category
            });
            category.subCategory.pull(result._id);
            await category.save();
            return {
                message: "Category deleted successfully!"
            }
        })
    },
    Category: {
        subCategory: async (parent) => {
            const subcategory = await Subcategory.find({
                _id: parent.subCategory
            })
            return subcategory;
        }
    },
    SubCategory: {
        category: async (parent, _, {loaders}) => {
            const category = await loaders.category.load(parent.category.toString());
            return category;
        }
    }
}