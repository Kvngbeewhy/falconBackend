const mongoose = require("mongoose");
const Joi = require("joi");

const ItemSchema = new mongoose.Schema({
    Id: String,
    categoryid: [
        { type: mongoose.Schema.Types.ObjectId, ref: "categoryid", required: false },
      ],
      name: String,
      image: { type: String, default: ""},
      quantity: {type: Number, default: 0},
      description: { type: String, default: ""},
      price: { type: String, default: ""},
      createdBy: String,
      lastmodifiedby: String,
      isdeleted: Boolean
}, {timestamps: true})

const Item = mongoose.model("Item", ItemSchema);

const ItemAuditSchema = new mongoose.Schema({
    Id: String,
    CategoryId: String,
      name: String,
      image: { type: String, default: ""},
      quantity: {type: Number, default: 0},
      description: { type: String, default: ""},
      price: { type: String, default: ""},
      createdBy: String,
      lastmodifiedby: String,
      isdeleted: Boolean
}, {timestamps: true})

const ItemAudit = mongoose.model("ItemAudit", ItemAuditSchema);

function validateItemPost(item){
const schema = {
    name: Joi.string().min(5).max(200).required(),
    quantity: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required,
    createdBy: Joi.string().required(),
};
return Joi.validate(item, schema)
}

   function validateItemPut(item){
    const schema = {
        name: Joi.string().min(5).max(200).required(),
        quantity: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.string().required(),
        lastmodifiedBy: Joi.string().required(),
    };
    return Joi.validate(item, schema)
}

module.exports.Item = Item;
module.exports.ItemAudit = ItemAudit;
module.exports.validateItemPost = validateItemPost;
module.exports.validateItemPut = validateItemPut;