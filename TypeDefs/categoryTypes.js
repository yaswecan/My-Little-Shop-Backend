const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getCategories: [Category]
        getCategory(id: ID): Category
        getSubCategories: [SubCategory]
        getSubCategory(id: ID): SubCategory
    }
    extend type Mutation {
        addCategory(name: String): successInfo
        addSubCategory(input: subInput): successInfo
        updateCategory(name: String, id: ID!): successInfo
        updateSubCategory(input: subInput, id: ID!): successInfo
        deleteCategory(id: ID!): successInfo
        deleteSubCategory(id: ID!): successInfo
    }
    input subInput {
        name: String
        category: ID
    }
    type Category {
        id: ID
        name: String
        subCategory: [SubCategory]
        createdAt: Date
        updatedAt: Date
    }
    type SubCategory {
        id: ID
        name: String
        category: Category
        createdAt: Date
        updatedAt: Date
    }
`;