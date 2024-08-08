const { skip } = require('graphql-resolvers');

module.exports.isSeller = (_, __, { reqUserInfo }) => {
    if (reqUserInfo.role !== "seller") throw new Error("Forbidden! Unauthorized request.");
    return skip;
}