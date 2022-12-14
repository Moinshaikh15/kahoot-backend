const express = require("express");
const UserModel = require("../module/userSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

let router = express.Router();
//SignUp
router.post("/signup", async (req, res) => {
  let { email, name, password, confirmPassword } = req.body;
  if ((!email, !name, !password, !confirmPassword)) {
    return res.status(400).send("All fields are required");
  }
  if (password !== confirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  let existingUser = await UserModel.find({ email: email });
  existingUser = existingUser[0];

  if (existingUser !== undefined) {
    return res.status(400).send("Email Already Exists");
  }

  let salt = await bcryptjs.genSalt(10);
  let hash = await bcryptjs.hash(password, salt);

  let newUser = new UserModel({
    name,
    email,
    password: hash,
  });

  try {
    let savedUser = await newUser.save();
    savedUser.password = undefined;
    return res.status(200).send(savedUser);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//Login
router.post("/login", async (req, res) => {
  let { googleId, tokenId, profileObj } = req.body;
  let { email, password } = req.body;
  let existingUser;
  let correctPass;
  if (googleId) {
    verify(tokenId);
    email = profileObj.email;
    existingUser = await UserModel.find({ email: email });
    existingUser = existingUser[0];
    if (existingUser === undefined) {
      let newUser = new UserModel({
        name: profileObj.name,
        email: profileObj.email,
        password: "",
      });
      try {
        let savedUser = await newUser.save();
        savedUser.password = undefined;
        existingUser = savedUser;
      } catch (err) {
        return res.status(400).send(err.message);
      }
    }
    correctPass = true;
  } else {
    if ((!email, !password)) {
      return res.status(400).send("email and password both required");
    }
    existingUser = await UserModel.find({ email: email });
    existingUser = existingUser[0];
    if (existingUser === undefined) {
      return res.status(400).send("Email does not Exists");
    }
    correctPass = await bcryptjs.compare(password, existingUser.password);
  }

  if (correctPass) {
    let payload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "3d",
    });
    let userInfo = existingUser;
    userInfo.password = undefined;
    return res.status(200).send({ accessToken, refreshToken, userInfo });
  } else {
    return res.status(400).send("Invalid Password");
  }

  async function verify(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
    
      const payload = ticket.getPayload();
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
      return payload;
    } catch (err) {
      return res.status(400).send(err);
    }
  }
});

// Token
router.get("/token", (req, res) => {
  let refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(400).send("please provide refresh token");
  }

  try {
    let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    delete payload.exp;
    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3d",
    });
    return res.status(200).send({ accessToken });
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
