const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
  },
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
