//Models
const {User} = require("../Models/userModel");

module.exports.batchUser = async (userIds) => {
    const users = await User.find({_id: {$in: userIds}});
    return userIds.map(userId => users.find(user => user.id === userId));
}