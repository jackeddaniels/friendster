const express = require("express");
const uploadImage  = require("../middleware/uploadImages");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();

// update profile image
router.post(
  "/register",
  uploadImage.single("image"),
  async function (req, res, next)  {
      /*
         req.file = {
           fieldname, originalname,
           mimetype, size, bucket, key, location
         }
      */

      // location key in req.file holds the s3 url for the image
      let data = {}
      if(req.file) {
          data.image = req.file.location
      }
      console.log("IN ROUTE", req.body)
      const newUser = await User.register ({...req.body, photo:req.file.location})
      const token = createToken(newUser);
      return res.status(201).json({token});


      // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE
  }
)

module.exports = router
