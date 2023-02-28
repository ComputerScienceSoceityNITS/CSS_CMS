const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  scholarID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codeforcesHandle: { type: String },
  githubHandle: { type: String },
  registeredEvents: {
    type: [mongoose.Schema.Types.ObjectId],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
