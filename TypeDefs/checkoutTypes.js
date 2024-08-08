const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getOrders: [Orders]
        getOrdersByUser: [Orders]
        getOrdersBySeller: [Orders]
        getOrder(id: ID): Orders
        getOrderByUser(id: ID): Orders
        getOrderBySeller(id: ID): Orders
    }
    extend type Mutation {
        stripePayment(input: stripeInput): successInfo
        paypalPayment(input: paypalInput): successInfo
    }
    input stripeInput {
        cart: ID
        paymentId: String
        shippingMethod: ID
        firstName: String
        lastName: String
        country: String
        address: String
        city: String
        zip: String
        email: String
        phone: String
        saveData: Boolean
    }
    input paypalInput {
        cart: ID
        paymentId: String
        payedAmount: Int
        shippingMethod: ID
        firstName: String
        lastName: String
        country: String
        address: String
        city: String
        zip: String
        email: String
        phone: String
        saveData: Boolean
    }
    type Orders {
        id: ID,
        products: [ProductsTypes]
        payedAmount: Int
        paymentInfo: PaymentInfo
        shippingMethod: Shipping
        firstName: String
        lastName: String
        country: String
        address: String
        city: String
        zip: String
        email: String
        phone: String
        status: String
        saveData: Boolean
        user: User
        createdAt: Date
        updatedAt: Date
    }
    type PaymentInfo {
        method: String
        paymentId: String
    }
    type ProductsTypes {
        product: Product
        quantity: Int
        price: Int
    }
`;