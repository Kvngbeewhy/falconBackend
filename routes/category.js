const config = require("config");
const mongoose = require("mongoose");
const response = require("../services/response");
const express = require("express");
const _ = require("lodash");
const { Category,
   validateCategoryPut,
   CategoryAudit } = require("../models/category");
const router = express.Router();
const { CATEGORY_CONSTANTS, AUTH_CONSTANTS } = require("../config/constant.js");
mongoose.set("debug", true);


router.get("/", async (req,res) => {
  let CategoryList = await Category.find({}, "-_id");
    if (!CategoryList)
      res.send({ statusCode: 400, message: CATEGORY_CONSTANTS.NOT_FOUND});
   res.send({ statusCode: 200,  data: { CategoryList } });

});

router.get("/list/:id", async (req, res)  => {
  var id = req.params.id;
  var list = Category.findById(id, function(err, data) {
    if (err){
      console.log(err);
      res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: list
  })
}
  else{
      console.log("Invalid : ", data);
    let resp = _.pick(data, ["name", "_id"]);
  res.send({ statusCode: 200, message: CATEGORY_CONSTANTS.CATEGORY_UPDATED, resp });

  };
  });


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


router.post("/", async (req, res) => {
    const { name,createdBy} = req.body;
  
    try {
      category = new Category({
        name,
        createdBy
      });
  
      // save category to db
      await category.save();
      return response.success(res, CATEGORY_CONSTANTS.CATEGORY_CREATED);
    } catch (err) {
      console.error(err.message);
      return response.error(res, err.message, 500);
    }
  });


  router.put("/update", async (req, res) => {
    const { error } = validateCategoryPut(req.body);
    if (error)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: error.details[0].message,
      });
      
    var category = Category.findOne(req.params.id);
    if (!category)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: CATEGORY_CONSTANTS.NOT_FOUND,
        
      });
    await logCurrentCategoryState(category);
  
    const { name, description, lastmodifiedby } = req.body;
    try {
      category = new Category({
        name,
        description,
        lastmodifiedby
      });
  
      // save category to db
      await category.save();
    } catch (err) {
      console.error(err.message);
      return response.error(res, err.message, 500);
    }
  
  
    res.send({ statusCode: 200, message: CATEGORY_CONSTANTS.CATEGORY_UPDATED });
  });

  router.delete("/:id", async (req, res) => {
    var id = req.params.id;
  var category  = Category.findByIdAndDelete(id, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted : ", docs);
    };
  });
    if (!category)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: CATEGORY_CONSTANTS.NOT_FOUND,
      });
    return res.send({ statusCode: 200, message: CATEGORY_CONSTANTS.CATEGORY_DELETED });
  });
  
  async function logCurrentCategoryState(){
    let categoryAudit = new CategoryAudit({
      name: Category.name,
      description: Category.description,
    });
    await categoryAudit.save();
  }
  



  module.exports = router;
