const express = require("express");
const uploadImage  = require("../middleware/uploadImages");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const { createToken } = require("../helpers/tokens");


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

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});

module.exports = router
