const mongoose = require("mongoose");
const { validateDate, validateTime } = require("../utils/validators");

const enigmaSchema = new mongoose.Schema({
  cfContestLink: {
    type: String,
    required: true,
    unique: true,
  },
  startDate: {
    type: String,
    required: true,
    validate: {
      validator: validateDate,
      message: "invalid start date",
    },
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: validateTime,
      message: "invalid start time",
    },
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
