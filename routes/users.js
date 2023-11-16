const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const {ensureLoggedIn} = require("../middleware/auth")

router.get("/search", ensureLoggedIn, async function (req, res, next)  {
  const users = await User.getWithinRadius(res.locals.user.username);
  //TODO: also filter by if user has liked/disliked make function in match model and call it here then return the final list back to client
  return res.json({users})
  }
)

module.exports = router;