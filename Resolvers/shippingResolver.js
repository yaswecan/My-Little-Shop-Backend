//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Shipping} = require("../Models/shippingModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations} = require("../Validations/shippingValidations");

module.exports = {
    Query: {
        getShippings: combineResolvers(isAuthenticated, async () => {
            const shipping = await Shipping.find();
            if (shipping.length === 0) throw new Error("Shipping list is empty!");
            return shipping;

        }),
        getShipping: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const shipping = await Shipping.findOne({
                _id: id
            });
            if (!shipping) throw new Error("Shipping not found!");
            return shipping;
        })
    },
    Mutation: {
        addShippingMethod: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const shipping = await Shipping.findOne({
                title: input.title
            });
            if (shipping) throw new Error("Try different title!");
            const newShipping = new Shipping(input);
            await newShipping.save();
            return {
                message: "Shipping added successfully!"
            }
        }),
        updateShipping: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key] || input[key] == null && delete input[key]);
            const result = await Shipping.findByIdAndUpdate(id, {...input}, {new: true});
            if (!result) throw new Error("Shipping method not found!");
            return {
                message: "Shipping method updated successfully!"
            }
        }),
        deleteShipping: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Shipping.findByIdAndDelete(id);
            if (!result) throw new Error("Shipping method not found!");
            return {
                message: "Shipping method deleted successfully!"
            }
        })
    }
}