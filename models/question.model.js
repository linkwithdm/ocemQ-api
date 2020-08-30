const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  answers: {
    a1: {
      type: String,
      required: true,
    },
    a2: {
      type: String,
      required: true,
    },
    a3: {
      type: String,
      required: true,
    },
    a4: {
      type: String,
      required: true,
    },
  },
  correct_answer_index: {
    type: String,
    required: true,
  },
});

const QuestionModel = mongoose.model("question", QuestionSchema);
module.exports = QuestionModel;
