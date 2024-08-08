const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getReviews: [Reviews]
        getReview(id: ID): Reviews
        getReviewsByProduct(product: ID): [Reviews]
        reviewAvailability(product: ID): availAbleInfo
        reviewSummery(product: ID): reviewSummeryInfo
    }
    extend type Mutation {
        addReview(input: reviewInput): successInfo
        updateReview(input: reviewUpdateInput, id: ID): successInfo
    }
    input reviewInput {
        product: ID
        rating: Int
        comment: String
    }
    input reviewUpdateInput {
        rating: Int
        comment: String
    }
    type Reviews {
        id: ID
        product: Product
        user: User
        rating: Int
        comment: String
        createdAt: Date
        updatedAt: Date
    }
    type availAbleInfo {
        available: Boolean
    }
    type reviewSummeryInfo {
        oneStar: Int
        twoStar: Int
        threeStar: Int
        fourStar: Int
        fiveStar: Int
    }
`;