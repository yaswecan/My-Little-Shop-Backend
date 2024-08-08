const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getBrands: [Brand]
        getBrand(id: ID): Brand
    }
    extend type Mutation {
        addBrand(input: brandInput): successInfo
        updateBrand(input: brandInput, id: ID): successInfo
        deleteBrand(id: ID): successInfo
    }
    input brandInput {
        name: String
    }
    type Brand {
        id: ID
        name: String
        createdAt: String
        updatedAt: String
    }
`