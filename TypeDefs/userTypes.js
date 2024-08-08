const {gql} = require("apollo-server-express");

module.exports = gql`
    extend type Query {
        getUsers: [User]
        getUser(id: ID): User
    }
    extend type Mutation {
        signup(input: signupInput): successInfo
        verifyOtp(input: otpInput): registerSuccess
        login(input: loginInput): registerSuccess
        googleAuth(input: authInput): registerSuccess
        facebookAuth(input: facebookAuthInput): registerSuccess
        updateUser(input: signupInput, avatar: Upload): successInfo
        checkEmailAvailability(email: String): successInfo
        userRoleUpdate(id: ID, role: String): successInfo
        deleteUser(id: ID): successInfo
        deleteOwnAccount: successInfo
    }
    input signupInput {
        name: String
        firstName: String
        lastName: String
        email: String
        phone: String
        password: String
        address: String
        country: String
        city: String
        zipCode: String
    }
    input otpInput {
        email: String
        otp: String
    }
    input loginInput {
        email: String
        password: String
    }
    input authInput {
        idToken: String
    }
    input facebookAuthInput {
        userId: String,
        accessToken: String
    }
    type successInfo {
        message: String
    }
    type registerSuccess {
        message: String
        token: String
        expire: Date
    }
    type User {
        id: ID
        name: String
        firstName: String
        lastName: String
        email: String
        phone: String
        password: String
        avatar: String
        provider: String
        googleId: String
        facebookId: String
        verified: Boolean
        address: String
        country: String
        city: String
        zipCode: String
        role: String
        createdAt: Date
        updatedAt: Date
    }
`