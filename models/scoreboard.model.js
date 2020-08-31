const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreboardSchema = new Schema({
  person: {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  points: {
    type: Number,
    required: true,
  },
});
const ScoreBoardModel = mongoose.model("scoreboard", ScoreboardSchema);
module.exports = ScoreBoardModel;
