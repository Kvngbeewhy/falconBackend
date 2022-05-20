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


module.exports.Brand = Brand;
