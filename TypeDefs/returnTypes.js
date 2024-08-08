const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getReturns: [Returns]
        getReturn(id: ID): Returns
    }
    extend type Mutation {
        addReturns(input: returnInput, file: Upload): successInfo
        updateReturns(accept: Boolean, id: ID): successInfo
        deleteReturns(id: ID): successInfo
    }
    input returnInput {
        products: [returnProductInput]
        reason: String
    }
    input returnProductInput {
        product: ID
        quantity: Int
    },
    type Returns {
        id: ID
        products: [ProductReturnTypes]
        reason: String
        accept: Boolean
        user: User
        createdAt: Date
        updatedAt: Date
    }
    type ProductReturnTypes {
        product: Product
        quantity: Int
    }
`;