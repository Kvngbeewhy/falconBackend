const config = require("config");
const mongoose = require("mongoose");
const response = require("../services/response");
const express = require("express");
const _ = require("lodash");
const router = express.Router();
const {Brand , 
  validateBrandPut, BrandAudit} = require("../models/brand");
const { BRAND_CONSTANTS, AUTH_CONSTANTS } = require("../config/constant.js");
mongoose.set("debug", true);

router.get("/", async (req,res) => {
    let brand = await Brand.find({}, "-_id");
    if(!brand)
    return res.status(400).send({
        statusCode: 400,
        message:  BRAND_CONSTANTS.NOT_FOUND,
        data: brand,
  })
  return res.send({ statusCode: 200, data: { brand }  });
});

router.get("/:id", async (req, res)  => {
  var id = req.params.id;
  var list = Brand.findById(id, function(err, data) {
    if (err){
      console.log(err);
      res.status(400).send({
        statusCode: 400,
        message:  BRAND_CONSTANTS.NOT_FOUND,
        data: list
  })
}
  else{
      console.log("Invalid : ", data);
    let resp = _.pick(data, ["name", "_id"]);
  res.send({ statusCode: 200, message: 'successful', resp });

  };
  });


});

router.put("/list", async (req, res) => {
  const { error } = validateBrandPut(req.body);
  if (error)
    return res.status(400).send({
      statusCode: 400,
      message: "Failure",
      data: error.details[0].message,
    });
    
  var brand = Brand.findOne(req.body);
  if (!brand)
    return res.status(400).send({
      statusCode: 400,
      message: BRAND_CONSTANTS.NOT_FOUND,
      data: brand,
      
    });
  await logCurrentBrandState(brand);

  const { name, description, lastmodified } = req.body;
  try {
    brand = new Brand({
      name,
      description,
      lastmodified
    });

    // save category to db
    await brand.save();
  } catch (err) {
    console.error(err.message);
    return response.error(res, err.message, 500);   
  }

  let resp = _.pick(brand, ["name", "description", "lastmodifiedby"]);

  res.send({ statusCode: 200, message: BRAND_CONSTANTS.BRAND_UPDATED, data: resp });
});

router.post("/", async (req,res) => {
  const { name, description,createdBy } = req.body;
  
    try {
      brand = new Brand({
        name,
        description,
        createdBy
      });
  
      // save item to db
      await brand.save();
      return response.success(res, BRAND_CONSTANTS.BRAND_CREATED);
    } catch (err) {
      console.error(err.message);
      return response.error(res, err.message, 500);
    }
})

router.delete("/:id", async (req, res) => {
  var id = req.params.id;
  var brand  = Brand.findByIdAndDelete(id, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted : ", docs);
    };
  });
  if (!brand)
    return res.status(400).send({
      statusCode: 400,
      message: "Failure",
      data: brand,
       });
  return res.send({ statusCode: 200, message: BRAND_CONSTANTS.BRAND_DELETED });
});

async function logCurrentBrandState(brand) {
  let brandAudit = new BrandAudit({
    name: brand.name,
    description: brand.description,
    createdBy: brand.createdBy
  });
  await brandAudit.save();
}

module.exports = router;
