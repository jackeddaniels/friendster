"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");

/**Model for the message table */
class Message {

  static async create(from_username, to_username, body ) {
    const result = await db.query(
      `INSERT INTO messages (from_username,
                                 to_username,
                                 body,
                                 sent_at)
             VALUES
               ($1, $2, $3, current_timestamp)
             RETURNING id, from_username AS "fromUsername", to_username AS "toUsername", body, sent_at AS "sentAt"`,
      [from_username, to_username, body]);

    return result.rows[0];
  }

  static async getMessages(user1, user2) {
    const result = await db.query(`
    SELECT from_username AS "fromUsername",
               to_username AS "toUsername",
               body,
               sent_at AS "sentAt"
    FROM messages
    WHERE (from_username = $1 AND to_username = $2)
        OR (from_username = $2 AND to_username = $1)
    ORDER BY sent_at`, [user1, user2]);

    const messages = result.rows;

    if (messages.length === 0) throw new NotFoundError("No messages...yet ;)");

    return messages;


  }
}

module.exports = Message;