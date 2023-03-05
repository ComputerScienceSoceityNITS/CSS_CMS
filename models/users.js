const mongoose = require("mongoose");
const { validateEmail, validateScholarID } = require("../utils/validators");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validateEmail,
      message: "please enter a valid email",
    },
  },
  scholarID: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validateScholarID,
      message: "please enter a valid scholar id",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  codeforcesHandle: {
    type: String,
    trim: true,
    lowercase: true,
  },
  githubHandle: {
    type: String,
    trim: true,
    lowercase: true,
  },
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
