const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  scholarID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codeforcesHandle: { type: String },
  githubHandle: { type: String },
  registeredAbacusEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Abacus",
  },
  registeredEnigmas: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Enigma",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
