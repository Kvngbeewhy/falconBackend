const mongoose = require("mongoose");
const Joi = require("joi");


const BrandSchema = new mongoose.Schema({
    brandid: String,
      name: String,
      description: { type: String, default: ""},
    status: { type: String, enum: ["active", "inactive", "removed"], default: "inactive" },
    createdBy: String,
      datecreated: {type: Date},
      lastmodifiedby: String,
      isdeleted: Boolean
}, {timestamps: true})

const Brand = mongoose.model("Brand", BrandSchema);

const BrandAuditSchema = new mongoose.Schema({
  brandid: String,
      name: String,
      description: { type: String, default: ""},
    status: { type: String, enum: ["active", "inactive", "removed"], default: "inactive" },
    createdBy: String,
      lastmodifiedby: String,
      isdeleted: Boolean
}, {timestamps: true})
const BrandAudit = mongoose.model("BrandAudit", BrandAuditSchema);

function validateBrandPut(brand){
  const schema = {
      name: Joi.string().min(5).max(200).required(),
      description: Joi.string().required(),
      lastmodifiedBy: Joi.string().required(),
  };
  return Joi.validate(brand, schema)
}

function validateBrandPost(brand){
  const schema = {
      id: Joi.string().required(), 
      name: Joi.string().min(5).max(200).required(),
      description: Joi.string().required(),
      createdBy: Joi.string().required(),
  };
  return Joi.validate(brand, schema)
}


module.exports.Brand = Brand;
module.exports.BrandAudit = BrandAudit;
module.exports.validateBrandPut = validateBrandPut;
module.exports.validateBrandPost = validateBrandPost;
