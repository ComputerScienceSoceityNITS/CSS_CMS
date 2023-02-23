const mongoose = require("mongoose");

const eSchema = new mongoose.Schema({
  participantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const eParticipant = mongoose.model("eParticipant", eSchema);

module.exports = eParticipant;
