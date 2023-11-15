"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");

/** User model class */
class User {

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, hobbies, interests, location, friendRadius }
   *
   * Throws BadRequestError on duplicates.
   **/
  static async register(
    { username,
      password,
      firstName,
      lastName,
      email,
      hobbies,
      interests,
      location,
      friendRadius }
      ) {
    const duplicateCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(`
      INSERT INTO users
        (username,
          password,
          first_name,
          last_name,
          email,
          hobbies,
          interests,
          location,
          friend_radius)
      VALUES ($1, $2, $3, $4, $5, $6, $8 , $9)
      RETURNING
          username,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          hobbies,
          interests,
          location,
          friendRadius
                    `, [
      username,
      hashedPassword,
      firstName,
      lastName,
      email,
      hobbies,
      interests,
      location,
      friendRadius
    ],
    );

    const user = result.rows[0];

    return user;
  }

  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, hobbies, interests, location, friendRadius}
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(`
        SELECT username,
               password,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               hobbies,
               interests,
               location,
               friend_radius AS "friendRadius

        FROM users
        WHERE username = $1`, [username],
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async get(username) {
    const userRes = await db.query(`
      SELECT username,
            password,
            first_name AS "firstName",
            last_name  AS "lastName",
            email,
            hobbies,
            interests,
            location,
            friend_radius AS "friendRadius
      FROM users
      WHERE username = $1 `, [username]
    );

    const user = userRes.rows[0]

    if(!user) throw new NotFoundError(`No user: ${username}`);

    const userPhotoRes = await db.query(`
      SELECT url
      FROM photos
      WHERE username = $1`, [username]
    );

    user.photos = userPhotoRes.rows.map(p => p.url);

    return user;
  }
}

module.exports = User