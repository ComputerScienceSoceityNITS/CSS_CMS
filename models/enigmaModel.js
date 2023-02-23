const mongoose = require("mongoose");

const enigmaSchema = new mongoose.Schema({
  cfContestLink: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
  winners: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

const Enigma = mongoose.model("Enigma", enigmaSchema);

module.exports = Enigma;
