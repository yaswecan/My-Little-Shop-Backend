const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getCoupons: [Coupon]
        applyCoupon(code: String): successInfo
    }
    extend type Mutation {
        addCoupon(input: couponInput): successInfo
        updateCoupon(input: couponInput, id: ID): successInfo
        deletedCoupon(id: ID): successInfo
    }
    input couponInput {
        code: String
        discount: Int
        expiresDate: String
    }
    type Coupon {
        id: ID
        code: String
        discount: String
        expiresDate: String
        createdAt: Date
        updatedAt: Date
    }
`;