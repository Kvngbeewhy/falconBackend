const config = require("config");
const mongoose = require("mongoose");
const response = require("../services/response");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {Item , 
  validateItemPut, ItemAudit} = require("../models/item");
const { ITEM_CONSTANTS, AUTH_CONSTANTS } = require("../config/constant.js");
mongoose.set("debug", true);

router.get("/", async (req,res) => {
  let itemList = await Item.find({}, "-_id");
    if (!itemList)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: ITEM_CONSTANTS.INVALID_ITEM,
  })
  return res.send({ statusCode: 200, message: "successful" });

});

router.get("/getlist/:id", async (req, res)  => {
  const { id } = req.params;
  let item = await item.findOne({
      _id: id});
  if (!item) return response.error(res, ITEM_CONSTANTS.INVALID_ITEM,); 
  return response.withDataAndMsg(res, category);

});

router.post("/", async (req, res) => {
    const { name, description, price, quantity,createdBy } = req.body;
  
    try {
      item = new Item({
        name,
        description,
        price,
        quantity,
        createdBy
      });
  
      // save item to db
      await item.save();
      return response.success(res, ITEM_CONSTANTS.ITEM_CREATED);
    } catch (err) {
      console.error(err.message);
      return response.error(res, err.message, 500);
    }
  });


  router.put("/update", async (req, res) => {
    const { error } = validateItemPut(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: error.details[0].message,
      });
      
    var item = Item.findOne(req.params.id);
    if (!item)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: ITEM_CONSTANTS.INVALID_ITEM,
      });
    await logCurrentItemState(Item);
  
    const { name,quantity,price,
      description, lastmodifiedBy} = req.body;
    try {
      item = new Item({
        name, quantity, 
        description,
        price,
        lastmodifiedBy
      });
  
      // save item to db
      await item.save();
    } catch (err) {
      console.error(err.message);
      return response.error(res, err.message, 500);
    }
  
    let resp = _.pick(item, ["name", "description","quantity", "price", "lastmodifiedby"]);
  
    res.send({ statusCode: 200, message: "Success", data: resp });
  });
  
router.delete("/:id", async (req, res) => {
  var id = req.params.id;
  var item  = Item.findByIdAndDelete(id, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted : ", docs);
    };
  });
  if (!item)
    return res.status(400).send({
      statusCode: 400,
      message: "Failure",
      data: ITEM_CONSTANTS.INVALID_ITEM,
       });
  return res.send({ statusCode: 200, message: ITEM_CONSTANTS.ITEM_DELETED });
});

async function logCurrentItemState(item) {
  let itemAudit = new ItemAudit({
    name: item.name,
      description: item.description,
  });
  await itemAudit.save();
}

module.exports = router;
