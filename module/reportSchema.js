const mongoose = require("mongoose");

let ReportSchema = new mongoose.Schema(
  {
    kahootId: {
      type: mongoose.Schema.ObjectId,
      ref: "Kahoot",
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
        id:{
            type:String,
        }
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Report", ReportSchema);
