const express = require("express");
const ReportModel = require("../module/reportSchema");

let router = express.Router();

//save new report
router.post("/new", async (req, res) => {
  let { kahootId, scores, teacherId } = req.body;
  console.log(req.body);
  let newReport = new ReportModel({
    kahootId,
    scores,
    teacherId,
  });

  try {
    let savedReport = await newReport.save();
    return res.status(200).send(savedReport);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

//save new report
router.get("/", async (req, res) => {
  try {
    let savedReport = await ReportModel.find({})
      .populate("kahootId", "title")
      .populate("teacherId", "name");
    return res.status(200).send(savedReport);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

module.exports = router;
