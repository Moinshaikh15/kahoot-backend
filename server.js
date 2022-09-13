const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

let app = express();

let DB_URL =
  "mongodb+srv://test:test123@cluster0.pkvnn0u.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUndefinedTopology: true })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("error", err.message));

app.use(cors);
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));

app.listen(process.env.PORT || 8000);
