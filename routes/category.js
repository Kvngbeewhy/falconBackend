const config = require("config");
const mongoose = require("mongoose");
const response = require("../services/response");
const express = require("express");
const { Category,
   validateCategoryPut,
   CategoryAudit } = require("../models/category");
const router = express.Router();
const { CATEGORY_CONSTANTS, AUTH_CONSTANTS } = require("../config/constant.js");
mongoose.set("debug", true);


router.get("/", async (req,res) => {
  let CategoryList = await Category.find({}, "-_id");
    if (!CategoryList)
      return res.status(400).send({
        statusCode: 400,
        message: "Failure",
        data: CATEGORY_CONSTANTS.NOT_FOUND,
  })
  return res.send({ statusCode: 200, message: "successful" });

});

router.get("/getlist/:id", async (req, res)  => {
  const { id } = req.params;
  let getlist = await Category.findOne({
      _id: id});
  if (!getlist) return response.error(res, CATEGORY_CONSTANTS.NOT_FOUND); 
  return response.withDataAndMsg(res, "succssful");

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
