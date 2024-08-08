const { skip } = require('graphql-resolvers');

module.exports.isSuperAdmin = (_, __, { reqUserInfo }) => {
    if (reqUserInfo.role !== "superAdmin") throw new Error("Forbidden! Unauthorized request.");
    return skip;
}