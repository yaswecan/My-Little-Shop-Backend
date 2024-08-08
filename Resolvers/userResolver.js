//Packages
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const {OAuth2Client} = require("google-auth-library");
const axios = require("axios");
const {combineResolvers} = require("graphql-resolvers");
//Models
const {User} = require("../Models/userModel");
const {Otp} = require("../Models/otpModel");
//Validations
const {signupValidation, otpValidation, loginValidation} = require("../Validations/userValidation");
//MiddleWare Functions
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
const {sendEmail} = require("../Middlewares/email");
const {readFile, deleteFile} = require("../Middlewares/file");
const {changeUserRole} = require("../Middlewares/userRole");
//Google Authentications
const client = new OAuth2Client(process.env.GOOGLE_ID)

module.exports = {
    Query: {
        getUsers: combineResolvers(isAuthenticated, isAdmin, async () => {
            const user = await User.find();
            if (user.lenght > 0) throw  new Error("User not found!");
            return user;
        }),
        getUser: combineResolvers(isAuthenticated, async (_, {id}) => {
            const user = await User.findOne({
                _id: id
            });
            if (!user) throw  new Error("User not found!");
            return user;
        })
    },
    Mutation: {
        signup: async (_, {input}) => {
            const {error} = signupValidation(input);
            if (error) throw new Error(error.details[0].message);
            const user = await User.findOne({
                email: input.email
            });
            if (user) throw new Error("User already exist!");
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
            const mailOptions = {
                email: input.email,
                subject: "One time password",
                code: otp
            }
            sendEmail(mailOptions);
            const temporUser = new Otp({...input, otp});
            temporUser.otp = await bcrypt.hash(temporUser.otp, 12);
            temporUser.password = await bcrypt.hash(temporUser.password, 12);
            await temporUser.save();
            return {
                message: "One time password sent to your email!"
            }
        },
        verifyOtp: async (_, {input}) => {
            const {error} = otpValidation(input);
            if (error) throw new Error(error.details[0].message);
            const holder = await Otp.findOne({
                email: input.email
            }).sort({createdAt: -1});
            if (!holder) throw new Error("Otp is expired!");
            const validOtp = await bcrypt.compare(input.otp, holder.otp);
            if (!validOtp) throw new Error("Otp is wrong!");
            const firstName = holder.name.substr(0, holder.name.indexOf(' '));
            const lastName = holder.name.substr(holder.name.indexOf(' ') + 1);
            const user = new User({
                name: holder.name,
                firstName,
                lastName,
                verified: true,
                password: holder.password,
                email: holder.email
            });
            const token = user.generateJWT();
            await user.save();
            await Otp.deleteMany({
                email: holder.email
            });
            let expire = new Date();
            expire.setDate(expire.getDate() + 30);
            return {
                message: "User created succesfully!",
                token,
                expire
            }
        },
        login: async (_, {input}) => {
            const {error} = loginValidation(input);
            if (error) throw new Error(error.details[0].message);
            const user = await User.findOne({
                email: input.email
            }).select("+password")
            if (!user) throw new Error("Wrong email or password!");
            const validPassword = await bcrypt.compare(input.password, user.password);
            if (!validPassword) throw new Error("Wrong email or password!");
            const token = user.generateJWT();
            let expire = new Date();
            expire.setDate(expire.getDate() + 30);
            return {
                message: "Login successfull!",
                token,
                expire
            }
        },
        googleAuth: async (_, {input: {idToken}}) => {
            const clientId = process.env.GOOGLE_ID;
            const {payload} = await client.verifyIdToken({idToken: idToken, audience: clientId});
            if (payload.email_verified) {
                const user = await User.findOne({
                    email: payload.email
                });
                let expire = new Date();
                expire.setDate(expire.getDate() + 30);
                if (!user) {
                    const newUser = new User({
                        name: payload.name,
                        firstName: payload.given_name,
                        lastName: payload.family_name,
                        email: payload.email,
                        verified: true,
                        avatar: payload.picture,
                        provider: payload.iss,
                        googleId: payload.sub
                    });
                    await newUser.save();
                    const token = newUser.generateJWT();
                    return {
                        message: "Authentication successful!",
                        token,
                        expire
                    }
                } else {
                    if (user.googleId && user.googleId === payload.sub) {
                        const token = user.generateJWT();
                        return {
                            message: "Authentication successful!",
                            token,
                            expire
                        }
                    } else {
                        throw new Error("Your account is already exit! Please login with your password or use facebook login")
                    }
                }
            } else {
                throw new Error("Something went wrong! Please use another account.")
            }
        },
        facebookAuth: async (_, {input}) => {
            const {userId, accessToken} = input;
            let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,picture,email&access_token=${accessToken}`;
            const {data} = await axios.get(urlGraphFacebook);
            if (data.id) {
                const user = await User.findOne({
                    email: data.email
                });
                let expire = new Date();
                expire.setDate(expire.getDate() + 30);
                if (!user) {
                    const firstName = data.name.substr(0, data.name.indexOf(' '));
                    const lastName = data.name.substr(data.name.indexOf(' ') + 1);
                    const newUser = new User({
                        name: data.name,
                        firstName,
                        lastName,
                        email: data.email,
                        avatar: data.picture.data.url,
                        verified: true,
                        provider: "graph.facebook.com",
                        facebookId: data.id
                    })
                    await newUser.save();
                    const token = newUser.generateJWT();
                    return {
                        message: "Authentication successful!",
                        token,
                        expire
                    }
                } else {
                    if (user.facebookId && user.facebookId === data.id) {
                        const token = user.generateJWT();
                        return {
                            message: "Authentication successful!",
                            token,
                            expire
                        }
                    } else {
                        throw new Error("Your account is already exit! Please login with your password or use google login")
                    }
                }
            } else {
                throw new Error("Something went wrong! Please use another account.")
            }
        },
        updateUser: combineResolvers(isAuthenticated, async (_, {input, avatar}, {reqUserInfo}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const emailAvailablity = await User.findOne({
                email: input.email
            })
            if (emailAvailablity) throw new Error("Email already in use!");
            const url = await readFile(avatar, "User");
            console.log(url);
            if (avatar) {
                await deleteFile(reqUserInfo.avatarId)
            }
            let name;
            if (!input.name) {
                name = `${input.firstName || reqUserInfo.firstName} ${input.lastName || reqUserInfo.lastName}`
            } else {
                name = input.name
            }
            const password = await bcrypt.hash(input.password, 10);
            await User.findByIdAndUpdate(reqUserInfo._id, {
                ...input,
                password,
                name,
                avatar: url.secure_url,
                avatarId: url.public_id
            }, {new: true})
            return {
                message: "User updated succesfully!"
            }
        }),
        checkEmailAvailability: combineResolvers(isAuthenticated, async (_, {email}) => {
            const user = await User.findOne({
                email: email
            });
            if (!user) {
                return {
                    message: "Email is available"
                }
            } else {
                return {
                    message: "Email is not available"
                }
            }
        }),
        userRoleUpdate: combineResolvers(isAuthenticated, async (_, {id, role}, {reqUserInfo}) => {
            const message = await changeUserRole(id, role, reqUserInfo);
            return {
                message
            }
        }),
        deleteUser: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const user = await User.findOne({
                _id: id
            })
            if (user.role === "superAdmin") throw new Error("You can't delete a Super Admin account");
            const result = await User.findByIdAndDelete(id);
            if (!result) throw new Error("User not found!")
            await deleteFile(result.avatarId);
            return {
                message: "User deleted successfully!"
            }
        }),
        deleteOwnAccount: combineResolvers(isAuthenticated, async (_, __, {reqUserInfo}) => {
            if (reqUserInfo.role === "superAdmin") throw new Error("Super Admin Acount can't be deleted!");
            const result = await User.findByIdAndDelete(reqUserInfo._id);
            if (!result) throw new Error("User not found!")
            await deleteFile(result.avatarId);
            return {
                message: "User deleted successfully!"
            }
        })
    }
}