const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        isWishListed(product: ID): wishlistInfo
    }
    extend type Mutation {
        addWishlist(product: ID): successInfo
    }
    type wishlistInfo {
        isWishListed: Boolean
    }
`;