const express = require("express");
const uploadImage  = require("../middleware/uploadImages");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const { createToken } = require("../helpers/tokens");

// update profile image
router.post(
  "/register",
  uploadImage.single("image"),
  async function (req, res, next)  {

      // location key in req.file holds the s3 url for the image
      let data = {...req.body}
      if(req.file) {
          data.photo = req.file.location
      }

      const newUser = await User.register (data)
      const token = createToken(newUser);
      return res.status(201).json({token});


      // HERE IS YOUR LOGIC TO UPDATE THE DATA IN DATABASE
  }
)

module.exports = router
