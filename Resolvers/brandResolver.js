//Packages
const {combineResolvers} = require("graphql-resolvers");
//Model
const {Brand} = require("../Models/brandModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations} = require("../Validations/brandValidations");

module.exports = {
    Query: {
        getBrands: async () => {
            const brand = await Brand.find();
            if (brand.length === 0) throw new Error("Brand list is empty!");
            return brand;
        },
        getBrand: async (_, {id}) => {
            const brand = await Brand.findOne({
                _id: id
            });
            if (!brand) throw new Error("Brand not found!");
            return brand
        }
    },
    Mutation: {
        addBrand: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const brand = await Brand.findOne({
                name: input.name
            });
            if (brand) throw  new Error("Brand is already created!");
            const newBrand = new Brand({...input});
            await newBrand.save();
            return {
                message: "Brand created successfully!"
            }
        }),
        updateBrand: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const brand = await Brand.findOne({
                name: input.name
            });
            if (brand) throw new Error("Brand is already listed")
            const result = await Brand.findByIdAndUpdate(id, {...input}, {new: true});
            if (!result) throw  new Error("Brand not found!");
            return {
                message: "Brand updated successfully!"
            }
        }),
        deleteBrand: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Brand.findByIdAndDelete(id);
            if (!result) throw new Error("Brand not found!");
            return {
                message: "Brand deleted successfully!"
            }
        })
    }
}