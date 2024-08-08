const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getCarts: [Cart]
        getCartsByUser: [CartForUser]
        getCart(id: ID): Cart
    }
    extend type Mutation {
        addCart(input: cartInput): successInfo
        updateCart(input: updateCartInput): successInfo
        increaseQuantity(input: cartInput): successInfo
        decreaseQuantity(input: cartInput): successInfo
        deleteCartProduct(input: cartInput): successInfo
    }
    input cartInput {
        product: ID
    }
    input updateCartInput {
        product: ID
        selected: Boolean
    }
    type Cart {
        id: ID
        products: [CartProductTypes]
        quantity: Int
        user: User
        subtotal: Int
        discountedPrice: Int
        coupon: Coupon
        createdAt: Date
        updatedAt: Date
    }
    type CartForUser {
        id: ID
        products: [CartProductTypes]
        quantity: Int
        user: User
        subtotal: Int
        discountedPrice: Int
        createdAt: Date
        updatedAt: Date
    }
    type CartProductTypes {
        product: Product,
        quantity: Int
        price: Int
    }
`;