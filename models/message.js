"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");

/**Model for the message table */
class Message {

  static async create({ from_username, to_username, body }) {
    const result = await db.query(
          `INSERT INTO messages (from_username,
                                 to_username,
                                 body,
                                 sent_at)
             VALUES
               ($1, $2, $3, current_timestamp)
             RETURNING id, from_username, to_username, body, sent_at`,
        [from_username, to_username, body]);

    return result.rows[0];
  }

  static async getMessages(user1, user2) {
    const toResult = await db.query(`
    SELECT from_username,
           to_username,
           url
    FROM messages
    WHERE from_username = $1 AND to_username = $2`,[user1, user2]);

    const toMessages = toResult.rows

    const fromResult = await db.query(`
    SELECT from_username,
           to_username,
           url
    FROM messages
    WHERE from_username = $1 AND to_username = $2`,[user2, user1]);

    const fromMessages = fromResult.rows

    return { toMessages, fromMessages }


  }
}