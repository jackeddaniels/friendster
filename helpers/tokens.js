"use strict";

const jwt = require("jsonwebtoken");


/** return signed JWT {username, isAdmin} from user data. */

function createToken(user) {

  let payload = {
    username: user.username,
    friendRadius: user.friendRadius
  };

  return jwt.sign(payload, process.env.SECRET_KEY);
}

module.exports = { createToken };
