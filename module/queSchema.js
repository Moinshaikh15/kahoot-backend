const mongoose = require("mongoose");

let QueSchema = new mongoose.Schema(
  {
    ques: {
      type: String,
      required: true,
    },
    options: [String],
    correctAns: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 20,
    },
    timeLimit: {
      type: Number,
      default: 20,
    },
    type: {
      type: String,
      default: "quiz",
    },
    imgUrl: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);
module.exports = mongoose.model("Que", QueSchema);
