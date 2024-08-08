//Models
const {Color} = require("../Models/colorModel");

module.exports.batchColor = async (colorIds) => {
    const colors = await Color.find({_id: {$in: colorIds}});
    return colorIds.map(colorId => colors.find(color => color.id === colorId));
}