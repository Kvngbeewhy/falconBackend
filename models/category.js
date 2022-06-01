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

const CategoryAuditSchema = new mongoose.Schema({
  categoryid: String,
    name: String,
    description: { type: String, default: ""},
  status: { type: String, enum: ["active", "inactive", "removed"], default: "inactive" },
  createdBy: String,
    datecreated: {type: Date},
    lastmodifiedby: String,
    isdeleted: Boolean
}, {timestamps: true})
const CategoryAudit = mongoose.model("CategoryAudit", CategoryAuditSchema);

function validateCategoryPost(category){
  const schema = {
      name: Joi.string().min(5).max(200).required(),
      createdBy: Joi.string().required(),
  };
  return Joi.validate(category, schema)
  }

  function validateCategoryPut(category){
    const schema = {
        name: Joi.string().min(5).max(200).required(),
        lastmodifiedBy: Joi.string().required(),
    };
    return Joi.validate(category, schema)
}

module.exports.CategoryAudit = CategoryAudit;
module.exports.Category = Category;
module.exports.validateCategoryPost = validateCategoryPost;
module.exports.validateCategoryPut = validateCategoryPut;