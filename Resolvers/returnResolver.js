//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Return} = require("../Models/returnModel");
const {Order} = require("../Models/ordersModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
const {readFile, deleteFile} = require("../Middlewares/file");


module.exports = {
    Query: {
        getReturns: combineResolvers(isAuthenticated, isAdmin, async () => {
            const returns = await Return.find();
            if (returns.length === 0) throw new Error("Returns list is empty!");
            return returns;
        }),
        getReturn: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const returns = await Return.findOne({
                _id: id
            });
            if (!returns) throw new Error("Returns not found!");
            return returns;
        })
    },
    Mutation: {
        addReturns: combineResolvers(isAuthenticated, async (_, {input, file}, {reqUserInfo}) => {
            const returns = await Return.exists({
                "products.product": {
                    $in: input.products.map(item => item.product)
                },
                user: reqUserInfo._id
            });
            if (returns) throw new Error("You already request to returns products!");
            const order = await Order.exists({
                "products.product": {
                    $all: input.products.map(item => item.product)
                },
                user: reqUserInfo._id
            });
            if (!order) throw new Error("You are not following return policy!");
            const fileUrl = await readFile(file, "Return")
            const newReturns = new Return({...input, user: reqUserInfo._id, file: fileUrl})
            await newReturns.save();
            return {
                message: "Returns product added successfully! We contact with you within 7 working days."
            }
        }),
        updateReturns: combineResolvers(isAuthenticated, isAdmin, async (_, {accept, id}) => {
            const returns = await Return.findOne({
                _id: id
            });
            if (!returns) throw new Error("Returns product not founds!");
            returns.accept = accept;
            await returns.save();
            return {
                message: "Returns updated successfully!"
            }
        }),
        deleteReturns: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Return.findByIdAndDelete(id);
            if (!result) throw new Error("Returns not found!");
            await deleteFile(result.file);
            return {
                message: "Returns deleted successfully!"
            }
        })
    },
    Returns: {
        user: async (parent, _, {loaders}) => {
            const user = await loaders.user.load(parent.user.toString());
            return user;
        }
    },
    ProductReturnTypes: {
        product: async (parent, _, {loaders}) => {
            const product = await loaders.product.load(parent.product.toString());
            return product;
        },
    }
}