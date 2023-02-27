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
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
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
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
});

const Abacus = mongoose.model("Abacus", abacusSchema);

module.exports = Abacus;
