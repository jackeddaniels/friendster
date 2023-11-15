const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const router = express.Router();
const { createToken } = require("../helpers/tokens");
const { geocoder } = require("../helpers/coordinates");

router.post("/search", async function (req, res, next)  {
  const friendRadius = res.locals.friendRadius;
  //call User method to query db for users within user's radius

  }
)