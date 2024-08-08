//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Color} = require("../Models/colorModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations} = require("../Validations/colorValidations");


module.exports = {
    Query: {
        getColors: async () => {
            const color = await Color.find();
            if (color.length === 0) throw new Error("Color list is empty!");
            return color;
        },
        getColor: async (_, {id}) => {
            const color = await Color.findOne({
                _id: id
            });
            if (!color) throw new Error("Color not found!");
            return color;
        }
    },
    Mutation: {
        addColor: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const color = await Color.findOne({
                name: input.name
            });
            if (color) throw new Error("Color is already created!");
            const newColor = new Color({...input});
            await newColor.save();
            return {
                message: "Color created successfully!"
            }
        }),
        updateColor: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const color = await Color.findOne({
                name: input.name
            });
            if (color) throw new Error("Color already created!");
            const result = await Color.findByIdAndUpdate(id, {...input}, {new: true});
            if (!result) throw new Error("Color not found!");
            return {
                message: "Color updated successfully!"
            }
        }),
        deleteColor: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Color.findByIdAndDelete(id);
            if (!result) throw new Error("Color not found");
            return {
                message: "Color deleted successfully!"
            }
        })
    }
}