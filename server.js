require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/auth");
const kahootRouter = require("./routes/kahoot");
const jwt = require("jsonwebtoken");
let app = express();

let DB_URL =
  "mongodb+srv://test:test123@cluster0.pkvnn0u.mongodb.net/Kahoot?retryWrites=true&w=majority";

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log("error", err.message));

//Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));

app.use("/auth", authRouter);
app.use(authenticateRequest);
app.use("/kahoot", kahootRouter);
app.listen(process.env.PORT || 8000);

function authenticateRequest(req, res, next) {
  let authHeaderInfo = req.headers["authorization"];

  if (authHeaderInfo === undefined) {
    return res.status(400).send("No token was provided");
  }
  let token = authHeaderInfo.split(" ")[1];
  if (token === undefined) {
    return res.status(400).send("Proper token was  not provided");
  }

  try {
    let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userInfo = payload;
    next();
  } catch (er) {
    return res.status(400).send(er.message);
  }
}
