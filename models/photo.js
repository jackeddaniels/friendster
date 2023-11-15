"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");

/**Model for the photo table */
class Photo {
  static async addPhoto(username, url) {
    const userCheck = await db.query(`
      SELECT username
      FROM users
      WHERE username = $1`, [username]
    );

    const user = userCheck.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(`
      INSERT INTO photos (username, url)
      VALUES ($1, $2)`, [username, url]);
  }
}

module.exports = Photo;