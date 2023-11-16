"use strict";
const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../expressError");

class Match {
  static async likeOrDislikeUser(username, targetUsername, isLiked) {
    const result = await db.query(`
    INSERT INTO user_preferences
    (username, target_username, is_liked)
    VALUES ($1, $2, $3)
    RETURNING username`, [username, targetUsername, isLiked]);

    const userData = result.rows[0];

    if (!userData) throw new NotFoundError(`No user: ${username}`);

    return userData;
  }

  static async getMatches(username) {
    const result = await db.query(`
    SELECT
      u.*
    FROM
      users u
    JOIN
      user_preferences up1 ON u.username = up1.target_username
    JOIN
      user_preferences up2 ON u.username = up2.username
    WHERE
      up1.is_liked = TRUE
      AND up2.is_liked = TRUE
      AND up1.username = up2.target_username
      AND up2.target_username = up1.username
      AND up1.username = $1;

    `, [username]);

    const users = result.rows;

    if (users.length === 0) throw new NotFoundError('You have no matches :(');

    return users;
  }
}

module.exports = Match;