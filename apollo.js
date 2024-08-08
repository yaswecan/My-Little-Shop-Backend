//Packages
const {ApolloServer} = require("apollo-server-express");
const Dataloader = require('dataloader');
//TypeDefs & Resolvers
const typeDefs = require("./TypeDefs/main");
const resolvers = require("./Resolvers/main");
//Midlewares
const {Token} = require("./Authorization/Token");
//Loaders
const loaders = require("./Loaders/main");

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        await Token(req);
        return {
            reqUserInfo: req.user,
            loaders: {
                category: new Dataloader(keys => loaders.categoryLoaders.batchCategory(keys)),
                subCategory: new Dataloader(keys => loaders.subCategoryLoaders.batchSubCategory(keys)),
                brand: new Dataloader(keys => loaders.brandLoaders.batchBrand(keys)),
                color: new Dataloader(keys => loaders.colorLoaders.batchColor(keys)),
                shipping: new Dataloader(keys => loaders.shippingLoaders.batchShipping(keys)),
                user: new Dataloader(keys => loaders.userLoaders.batchUser(keys)),
                product: new Dataloader(keys => loaders.productLoaders.batchProduct(keys)),
                coupon: new Dataloader(keys => loaders.couponLoaders.batchCoupon(keys))
            }
        }
    },
    formatError: (error) => {
        return {
            message: error.message
        }
    }
});

module.exports = apolloServer;