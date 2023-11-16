const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const matchRoutes = require("./routes/matches");
const { authenticateJWT } = require("./middleware/auth");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("./expressError");
//TOOD:Multer S3 goes here for sending filed

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/matches", matchRoutes);


app.get("/", function (req, res, next) {
  res.status(200).send("Response from root");
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
