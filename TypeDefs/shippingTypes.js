const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getShippings: [Shipping]
        getShipping(id: ID): Shipping
    }
    extend type Mutation {
        addShippingMethod(input: shippingInput): successInfo
        updateShipping(input: shippingInput, id: ID): successInfo
        deleteShipping(id: ID): successInfo
    }
    input shippingInput {
        title: String
        deliveryTime: String
        fees: Int
    }
    type Shipping {
        id: ID,
        title: String
        deliveryTime: String
        fees: Int
        createdAt: Date
        updatedAt: Date
    }
`;