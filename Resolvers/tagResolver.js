//Packages
const {combineResolvers} = require("graphql-resolvers");
//Models
const {Tag} = require("../Models/tagModel");
//Middlewares
const {isAuthenticated} = require("../Authorization/Authorize");
const {isAdmin} = require("../Authorization/Admin");
//Validations
const {addValidations} = require("../Validations/tagValidations");


module.exports = {
    Query: {
        getTags: async () => {
            const tag = await Tag.find();
            if (tag.lentgh === 0) throw new Error("Tag list is empty!");
            return tag
        },
        getTag: async (_, {id}) => {
            const tag = await Tag.findOne({
                _id: id
            });
            if (!tag) throw new Error("Tag is not found!");
            return tag;
        }
    },
    Mutation: {
        addTag: combineResolvers(isAuthenticated, isAdmin, async (_, {input}) => {
            const {error} = addValidations(input);
            if (error) throw new Error(error.details[0].message);
            const tag = await Tag.findOne({
                name: input.name
            });
            if (tag) throw new Error("Tag already created!");
            const newTag = new Tag({...input});
            await newTag.save();
            return {
                message: "Tag created successfully!"
            }
        }),
        updateTag: combineResolvers(isAuthenticated, isAdmin, async (_, {input, id}) => {
            Object.keys(input).forEach((key) => input[key] == '' && delete input[key]);
            const tag = await Tag.findOne({
                name: input.name
            });
            if (tag) throw new Error("Tag already listed!")
            const result = await Tag.findByIdAndUpdate(id, {...input}, {new: true});
            if (!result) throw new Error("Tag not found!");
            return {
                message: "Tag is updated successfully!"
            }
        }),
        deleteTag: combineResolvers(isAuthenticated, isAdmin, async (_, {id}) => {
            const result = await Tag.findByIdAndDelete(id);
            if (!result) throw new Error("Tag not found");
            return {
                message: "Tag deleted successfully!"
            }
        })
    }
}