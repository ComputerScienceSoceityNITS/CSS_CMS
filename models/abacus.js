const mongoose = require("mongoose");

const abacusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
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
  startingTime: {
    type: Date,
    required: true
  },
  eventType: {
    type: String,
    required: true,
  },
  teams: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Team",
  },
  minTeamSize: {
    type: Number,
  },
  maxTeamSize: {
    type: Number,
  },
  winners: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Team",
  },
  coverPic: {
    type: String
  }
});

const Abacus = mongoose.model("Abacus", abacusSchema);

module.exports = Abacus;
