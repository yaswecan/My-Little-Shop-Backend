const {User} = require("../Models/userModel");
const {Seller} = require("../Models/sellerModel");

module.exports.changeUserRole = async (id, role, reqUserInfo) => {
    const user = await User.findOne({
        _id: id
    });
    if (!user) return "User not found!";
    if (reqUserInfo.role === "admin" || reqUserInfo.role === "superAdmin") {
        if (role === "seller" || role === "user") {
            if (user.role !== "superAdmin") {
                const result = await User.findByIdAndUpdate(id, {role}, {new: true});
                const seller = await Seller.findOne({
                    user: id
                });
                if (role === "seller") {
                    seller.accept = true
                } else if (role === "user") {
                    seller.accept = false
                }
                await seller.save();
                return `${result.name} is now ${role}`
            } else {
                return `You can't make a superAdmin to ${role}`
            }
        } else if (reqUserInfo.role === "superAdmin") {
            if (role === "admin") {
                if (user.role !== "superAdmin") {
                    const result = await User.findByIdAndUpdate(id, {role}, {new: true})
                    return `${result.name} is now ${role}`
                } else {
                    return `You can't make a superAdmin to ${role}`
                }
            } else if (role === "superAdmin") {
                if (user.role !== "superAdmin") {
                    const result = await User.findByIdAndUpdate(id, {role}, {new: true})
                    reqUserInfo.role = "admin";
                    await reqUserInfo.save();
                    return `${result.name} is now ${role}`
                } else {
                    return `You are already a superAdmin!`
                }
            }
        } else {
            return `You can't make this user to ${role}`
        }
    } else {
        return `You have no rights to change user role`
    }
}