const express = require("express");
const authRoutes = require("./routes/auth")
//TOOD:Multer S3 goes here for sending filed

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", authRoutes);


app.get("/", function (req, res, next) {
  res.status(200).send("Response from root");
});

module.exports = app;
