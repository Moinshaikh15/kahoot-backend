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
     { type: mongoose.Schema.ObjectId,
      ref: "ques",}
    ],
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Kahoot", KahootSchema);
