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
