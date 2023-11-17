const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Match = require("../models/match")
const Message = require("../models/message")
const router = express.Router();
const {ensureLoggedIn} = require("../middleware/auth")

router.get("/:touser", async function (req, res, next) {
  const toUser = req.params.touser
  const messages = await Message.getMessages(res.locals.user.username, toUser)
  console.log("IN ROUTE GET MESSGES", messages)
  return res.json({ messages })
  }
)

router.post("/send", ensureLoggedIn, async function (req,res,next) {
  console.log("IN SEND MSG ROUTE", req.body)
  const { username, targetUsername, body } = req.body
  const message = await Message.create(username, targetUsername, body)
  return res.json({ message })
  }
)

module.exports = router;