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
});

const Enigma = mongoose.model("Enigma", enigmaSchema);

module.exports = Enigma;
