const mongoose = require("mongoose");

let ReportSchema = new mongoose.Schema(
  {
    kahootId: {
      type: mongoose.Schema.ObjectId,
      ref: "Kahoot",
    },
    teacherId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    scores: [
      {
        name: {
          type: String,
          required: true,
        },
        count: {
          type: String,
          required: true,
        },
        id: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Report", ReportSchema);
