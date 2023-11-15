const express = require("express");
const app = express();
//TOOD:Multer S3 goes here for sending filed

app.use(express.json());
app.use(express.urlencoded());

module.exports = app;
