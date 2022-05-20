const mongoose = require("mongoose");
const Joi = require("joi");



const CategorySchema = new mongoose.Schema({
    categoryid: String,
      name: String,
      description: { type: String, default: ""},
    status: { type: String, enum: ["active", "inactive", "removed"], default: "inactive" },
    createdBy: String,
      datecreated: {type: Date},
      lastmodifiedby: String,
      isdeleted: Boolean
}, {timestamps: true})

const Category = mongoose.model("Category", CategorySchema);


module.exports.Category = Category;
