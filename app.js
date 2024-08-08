const express = require("express");
const cors = require("cors");
const { join } = require("path");
//App
const app = express();

app.use(express.static(join(__dirname, './Upload')));
app.use(express.json());
app.use(cors());

module.exports = app;