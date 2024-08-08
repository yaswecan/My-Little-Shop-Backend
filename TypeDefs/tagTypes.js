const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getTags: [Tag]
        getTag(id: ID): Tag
    }
    extend type Mutation {
        addTag(input: tagInput): successInfo
        updateTag(input: tagInput, id: ID): successInfo
        deleteTag(id: ID): successInfo
    }
    input tagInput {
        name: String
    }
    type Tag {
        id: String
        name: String
        createdAt: Date
        updatedAt: Date
    }
`;