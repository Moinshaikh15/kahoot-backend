const mongoose = require("mongoose");

let KahootSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    timeLimit: {
      type: Number,
      default: 20,
    },
    questions: [
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
        type: {
          type: String,
          default: "quiz",
        },
        imgUrl: {
          type: String,
          default: "",
        },
      },
    ],
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Kahoot", KahootSchema);
