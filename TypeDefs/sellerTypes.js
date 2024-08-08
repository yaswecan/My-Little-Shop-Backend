const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getSellers(input: sellerFilterInput): [Seller]
        getSeller(id: ID): Seller
        getProductBySeller(input: sellerFilterInput, id: ID): [Product]
    }
    extend type Mutation {
        addSeller(input: sellerInput, image: Upload!): successInfo
        updateSeller(input: sellerUpdateInput, image: Upload): successInfo
        deleteSeller(id: ID): successInfo
    }
    input sellerInput {
        name: String
        address: String
        phone: String
        description: String
    }
    input sellerUpdateInput {
        address: String
        phone: String
        description: String
    }
    input sellerFilterInput {
        order: String
        sortBy: String
        limit: Int
        page: Int
        name: String
    }
    type Seller {
        id: ID
        name: String
        user: User
        accept: Boolean
        shopImage: String
        address: String
        phone: String
        description: String
        rating: Int
        reviews: Int
        shipTime: Int
        chatResponse: Int
        createdAt: Date
        updatedAt: Date
    }
`;