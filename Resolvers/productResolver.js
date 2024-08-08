//Packages
const {combineResolvers} = require("graphql-resolvers");
//Model
const {Product} = require("../Models/productModel");
const {User} = require("../Models/userModel");
const {Tag} = require("../Models/tagModel");
//Midllewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
const {isSeller} = require("../Authorization/Seller");
const {multipleReadFile, multipleFileDelete} = require("../Middlewares/file");
const {removeEmptyString} = require("../Middlewares/emptyString");
//Validations
const {addProductValidation} = require("../Validations/productValidation");


module.exports = {
    Query: {
        getProducts: async (_, {input}) => {
            const order = input?.order === 'aesc' ? 1 : -1;
            const sortBy = input?.sortBy ? input.sortBy : '_id';
            const limit = parseInt(input?.limit);
            const currentPage = Number(input?.page) || 1;
            const skip = limit * (currentPage - 1);
            const filters = input?.filters;
            let args = {};
            for (let key in filters) {
                if (filters[key].length > 0) {
                    if (key === "name") {
                        args["name"] = {
                            $regex: filters['name'],
                            $options: 'i'
                        }
                    }
                    if (key === "price") {
                        args['price'] = {
                            $gte: parseInt(filters['price'][0]),
                            $lte: parseInt(filters['price'][1]),
                        }
                    }
                    if (key === "category") {
                        args["category"] = filters['category']
                    }
                    if (key === "subCategory") {
                        if (filters["subCategory"].length > 0) {
                            args["subCategory"] = {
                                $in: filters['subCategory'].map(item => item.name)
                            }
                        }
                    }
                    if (key === "brand") {
                        if (filters["brand"].length > 0) {
                            args["brand"] = {
                                $in: filters["brand"].map(item => item.name)
                            }
                        }
                    }
                    if (key === "color") {
                        if (filters["color"].length > 0) {
                            args["images"] = {
                                $elemMatch: {
                                    color: {
                                        $in: filters['color'].map(item => item.name)
                                    }
                                }
                            }
                        }
                    }
                    if (key === "tag") {
                        if (filters["tag"].length > 0) {
                            args["tags"] = {
                                $elemMatch: {
                                    name: {
                                        $in: filters['tag'].map(item => item.name)
                                    }
                                }
                            }
                        }
                    }
                    if (key === "discount") {
                        args['discount'] = {
                            $gte: parseInt(filters['discount'][0]),
                            $lte: parseInt(filters['discount'][1]),
                        }
                    }
                }
            }
            const count = await Product.countDocuments(args);
            const products = await Product.find(args)
                .sort({[sortBy]: order})
                .limit(limit)
                .skip(skip)
            if (products.length === 0) throw new Error("Nothing found!");
            return {
                products,
                pageInfo: {
                    resultPerPage: limit || "Not set",
                    count
                }
            };
        },
        getProduct: async (_, {id}) => {
            const product = await Product.findOne({
                _id: id
            });
            if (!product) throw new Error("Product not found!");
            return product
        }
    },
    Mutation: {
        addProducts: combineResolvers(isAuthenticated, isSeller, async (_, {input, images}, {reqUserInfo}) => {
            const {error} = addProductValidation(input);
            if (error) throw new Error(error.details[0].message);
            const fileUrl = await multipleReadFile(images, "Product");
            console.log(fileUrl);
            const discount = Math.floor(((input.originalPrice - input.price) / input.originalPrice) * 100)
            const product = new Product({...input, discount, images: fileUrl, seller: reqUserInfo._id});
            await product.save();
            return {
                message: "Product Uploaded successfully!"
            }
        }),
        updateProducts: combineResolvers(isAuthenticated, isSeller, async (_, {
            input,
            images,
            id
        }, {reqUserInfo}) => {
            input = await removeEmptyString(input);
            const product = await Product.findOne({
                _id: id,
                seller: reqUserInfo._id
            });
            if (!product) throw new Error("Product not found!");
            const fileUrl = await multipleReadFile(images, "Product");
            if (images.length > 0) {
                await multipleFileDelete(product.images)
            }
            await Product.findByIdAndUpdate(id, {...input, images: fileUrl}, {new: true});
            return {
                message: "Product updated successfully!"
            }
        }),
        deleteProducts: combineResolvers(isAuthenticated, isSeller, async (_, {id}, {reqUserInfo}) => {
            const result = await Product.findOneAndDelete({
                _id: id,
                seller: reqUserInfo._id
            })
            if (!result) throw new Error("Product not found!");
            await multipleFileDelete(result.images);
            return {
                message: "Product deleted successfully!"
            }
        })
    },
    Product: {
        category: async (parent, _, {loaders}) => {
            const category = await loaders.category.load(parent.category.toString());
            return category;
        },
        subCategory: async (parent, _, {loaders}) => {
            const subcategory = await loaders.subCategory.load(parent.subCategory.toString());
            return subcategory;
        },
        brand: async (parent, _, {loaders}) => {
            const brands = await loaders.brand.load(parent.brand.toString());
            return brands;
        },
        tags: async (parent) => {
            const tags = await Tag.find({_id: parent.tags.map(item => item.name)});
            return tags;
        }
    },
    Images: {
        color: async (parent, _, {loaders}) => {
            const color = await loaders.color.load(parent.color.toString());
            return color;
        }
    }
}