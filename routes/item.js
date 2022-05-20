const config = require("config");
const mongoose = require("mongoose");
const response = require("../services/response");
const express = require("express");
const router = express.Router();
const { ITEM_CONSTANTS, AUTH_CONSTANTS } = require("../config/constant.js");
mongoose.set("debug", true);



router.post("/", async (req, res) => {
    const { name, description, price, quantity, image } = req.body;
  
    try {
      tab = new Tab({
        name,
        description,
        price,
        quantity,
        image,
        createdBy
      });
  
      // save user to db
      await tab.save();
    } catch (err) {
      console.error(err.message);
      return response.error(res, err.message, 500);
    }
  });
  