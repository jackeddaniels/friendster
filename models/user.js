"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");


/** User model class */
class User {

  /** Register user with data.
   *
   * Returns { username, firstName, lastName, email, hobbies, interests, zipcode, latitude,
      longitude, friendRadius }
   *
   * Throws BadRequestError on duplicates.
   **/
  //TODO: use multer/multer S3 (for parsing incoming file data), AWS-SDK as middleware for photo uploads to deal with files

  static async register(
    { username,
      password,
      firstName,
      lastName,
      email,
      hobbies,
      interests,
      zipcode,
      latitude,
      longitude,
      friendRadius,
      photo }
      ) {
    const duplicateCheck = await db.query(`
        SELECT username
        FROM users
        WHERE username = $1`, [username],
    );

    if (duplicateCheck.rows.length > 0) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(`
      INSERT INTO users
        (username,
          password,
          first_name,
          last_name,
          email,
          hobbies,
          interests,
          zipcode,
          latitude,
          longitude,
          friend_radius,
          photo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9, $10, $11, $12)
      RETURNING
          username,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          hobbies,
          interests,
          zipcode,
          latitude,
          longitude,
          friend_radius AS "friendRadius",
          photo
                    `, [
      username,
      hashedPassword,
      firstName,
      lastName,
      email,
      hobbies,
      interests,
      zipcode,
      latitude,
      longitude,
      friendRadius,
      photo
    ],
    );

    const user = result.rows[0];

    return user;
  }

  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name, email, hobbies, interests, zipcode, latitude,
      longitude, friendRadius}
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
               zipcode,
               latitude,
               longitude,
               friend_radius AS "friendRadius",
               photo

        FROM users
        WHERE username = $1`, [username],
    );

    const user = result.rows[0];
    console.log("IN AUTH", username, password)

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
            zipcode,
            latitude,
            longitude,
            friend_radius AS "friendRadius,
            photo
      FROM users
      WHERE username = $1 `, [username]
    );

    const user = userRes.rows[0]

    if(!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  //get users within radius
  static async getWithinRadius(friendRadius) {

    //query db to get all users within radius
    

  }



}

module.exports = User