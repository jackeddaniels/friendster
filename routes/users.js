const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const {ensureLoggedIn} = require("../middleware/auth")

router.get("/search", ensureLoggedIn, async function (req, res, next)  {
  const users = await User.getWithinRadius(res.locals.user.username);
  return res.json({users})
  }
)

router.get("/:username", async function (req, res, next) {
  const user = await User.get(req.params.username);
  return res.json({user})
})

module.exports = router;