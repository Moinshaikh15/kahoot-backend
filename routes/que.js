const express = require("express");
const QueModel = require("../module/queSchema");
const multer = require("multer");
let router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploads = multer({ storage: storage });
//create new kahoot
router.post("/new", uploads.single("img"), async (req, res) => {
  let { ques, one, two, three, four, correctAns, type } = req.body;
  let options = [one, two, three, four];
  // questions = JSON.parse(questions);
  let imgUrl = req.file
    ? process.env.BASE_URL + "uploads/" + req.file.filename
    : "";

  let newQue = new QueModel({
    ques,
    options,
    correctAns,
    type,
    imgUrl,
  });

  try {
    let savedQue = await newQue.save();
    return res.status(200).send(savedQue);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//get all kahoots
router.get("/", async (req, res) => {
  try {
    let ques = await QueModel.find({});
    return res.status(200).send(ques);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});
module.exports = router;
