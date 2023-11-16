const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Match = require("../models/match")
const router = express.Router();
const {ensureLoggedIn} = require("../middleware/auth")

router.get("/", ensureLoggedIn, async function (req, res, next) {
    const users = await Match.getMatches(res.locals.user.username)
    return res.json({ users })
  }
)

router.post("/preference", ensureLoggedIn, async function (req,res,next) {
    const { username, targetUsername, isLiked } = req.body
    const result = await Match.likeOrDislikeUser(username, targetUsername, isLiked)
    return res.json({ result })
  }
)

module.exports = router;