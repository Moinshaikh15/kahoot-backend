const express = require("express");
const KahootModel = require("../module/kahootSchema");
const multer = require("multer");
const mongoose = require("mongoose");
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
router.post("/new", uploads.single("image"), async (req, res) => {
  let { title, timeLimit, questions, creator } = req.body;
  // questions = JSON.parse(questions);
  let imgUrl = req.file
    ? process.env.BASE_URL + "uploads/" + req.file.filename
    : "no";
  console.log(questions);

  if (questions === undefined || questions.length === 0) {
    return res.status(400).send("Please add questions to kahoot");
  }

  let newkahoot = new KahootModel({
    title,
    timeLimit,
    questions,
    creator,
  });

  try {
    let savedKahoot = await newkahoot.save();
    return res.status(200).send(savedKahoot);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//get all kahoots
router.get("/", async (req, res) => {
  try {
    let kahoots = await KahootModel.find({});
    return res.status(200).send(kahoots);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//get a kahoot
router.get("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let kahoot = await KahootModel.find({ _id: id });
    return res.status(200).send(kahoot);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//edit kahoot
router.post("/:id/edit", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  try {
    let kahoot = await KahootModel.findByIdAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body.productId) },
      { $set: { kahoots: data } }
    );
    return res.status(200).send("updated successfully");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//Delete kahoot
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let kahoot = await KahootModel.deleteOne({ _id: id });
    return res.status(200).send("kahoot deleted");
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
