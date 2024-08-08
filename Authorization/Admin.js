const {skip} = require('graphql-resolvers');

module.exports.isAdmin = (_, __, {reqUserInfo}) => {
    if (reqUserInfo.role !== "admin" && reqUserInfo.role !== "superAdmin") throw new Error("Forbidden! Unauthorized request.");
    return skip;
}