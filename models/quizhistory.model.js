const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuizHistorySchema = new Schema(
  {
    qid: {
      type: Number,
      required: true,
    },
    uid: {
      type: Number,
      required: true,
    },
    result: {
      type: String,
      enum: ["Correct Answer", "Wrong Answer"],
    },
  },
  {
    timestamps: true,
  }
);

const QuizHistoryModel = mongoose.model("quizhistory", QuizHistorySchema);
module.exports = QuizHistoryModel;
