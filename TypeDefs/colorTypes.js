const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getColors: [Color]
        getColor(id: ID): Color
    }
    extend type Mutation {
        addColor(input: colorInput): successInfo
        updateColor(input: colorInput, id: ID): successInfo
        deleteColor(id: ID): successInfo
    }
    input colorInput {
        name: String
    }
    type Color {
        id: ID
        name: String
        createdAt: Date
        updatedAt: Date
    }
`;