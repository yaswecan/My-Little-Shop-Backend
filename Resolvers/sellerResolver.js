//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Seller} = require("../Models/sellerModel");
const {User} = require("../Models/userModel");
const {Product} = require("../Models/productModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
const {isSeller} = require("../Authorization/Seller");
const {readFile, deleteFile} = require("../Middlewares/file");
//Validations
const {addValidations} = require("../Validations/sellerValidations");


module.exports = {
    Query: {
        getSellers: async (_, {input}) => {
            const order = input?.order === 'aesc' ? 1 : -1;
            const sortBy = input?.sortBy ? input.sortBy : '_id';
            const limit = parseInt(input?.limit);
            const currentPage = Number(input?.page) || 1;
            const skip = limit * (currentPage - 1);
            let args = {};
            if (input.name) {
                args["name"] = {
                    $regex: input.name,
                    $options: 'i'
                }
            }
            const seller = await Seller.find(args)
                .sort({[sortBy]: order})
                .limit(limit)
                .skip(skip)
            if (seller.length === 0) throw new Error("Seller list is empty!");
            return seller;
        },
        getProductBySeller: async (_, {input, id}) => {
            const order = input?.order === 'aesc' ? 1 : -1;
            const sortBy = input?.sortBy ? input.sortBy : '_id';
            const limit = parseInt(input?.limit);
            const currentPage = Number(input?.page) || 1;
            const skip = limit * (currentPage - 1);
            let args = {};
            if (input.name) {
                args["name"] = {
                    $regex: input.name,
                    $options: 'i'
                }
            }
            const seller = await Seller.findOne({
                _id: id
            });
            args["seller"] = seller.user
            const product = await Product.find(args)
                .sort({[sortBy]: order})
                .limit(limit)
                .skip(skip)
            if (product.length === 0) throw new Error("Product list is empty!");
            return product;
        },
        getSeller: async (_, {id}, {reqUserInfo}) => {
            const seller = await Seller.findOne({
                _id: id,
                user: reqUserInfo._id
            });
            if (!seller) throw new Error("Seller not found!");
            return seller;
        }
    },
    Mutation: {
        addSeller: combineResolvers(isAuthenticated, async (_, {input, image}, {reqUserInfo}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const seller = await Seller.findOne({
                user: reqUserInfo._id
            });
            if (seller) throw new Error("You already create a shop!");
            const fileUrl = await readFile(image, "Seller")
            const newSeller = new Seller({
                ...input,
                shopImage: fileUrl.secure_url,
                imageId: fileUrl.public_id,
                user: reqUserInfo._id
            });
            await newSeller.save();
            return {
                message: "Seller request placed successfully! We contact with you within 1 working day"
            }
        }),
        updateSeller: combineResolvers(isAuthenticated, isSeller, async (_, {input, image}, {reqUserInfo}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const seller = await Seller.findOne({
                user: reqUserInfo._id
            });
            if (!seller) throw new Error("Seller not found!");
            const fileUrl = await readFile(image, "Seller");
            if (image) {
                await deleteFile(seller.imageId)
            }
            const result = await Seller.findByIdAndUpdate(seller._id, {...input, shopImage: fileUrl}, {new: true});
            return {
                message: "Profile updated successfully!"
            }
        }),
        deleteSeller: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Seller.findByIdAndDelete(id);
            if (!result) throw new Error("Seller not found!");
            const user = await User.findOne({
                _id: result.user
            });
            user.role = "user";
            await user.save();
            await deleteFile(result.imageId);
            return {
                message: "Seller deleted successfully!"
            }
        })
    },
    Seller: {
        user: async (parent, _, {loaders}) => {
            const user = await loaders.user.load(parent.user.toString());
            return user;
        }
    }
}