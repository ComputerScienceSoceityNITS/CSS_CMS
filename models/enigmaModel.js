const mongoose = require("mongoose");

const enigmaSchema = new mongoose.Schema({
  cfContestLink: {
    type: String,
    required: true,
    unique: true,
  },
  start: {
    type: Date,
    unique: true,
    required: true,
  },
  durationInHrs: {
    type: Number,
    required: true,
    default: 3,
  },
  questionSetters: {
    type: [String],
    default: [],
  },
  questionTesters: {
    type: [String],
    default: [],
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  winners: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

const Enigma = mongoose.model("Enigma", enigmaSchema);

module.exports = Enigma;
