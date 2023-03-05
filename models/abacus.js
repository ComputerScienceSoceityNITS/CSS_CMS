const mongoose = require("mongoose");
const {
  validateDate,
  validateMaxTeamSize,
  validateMinTeamSize,
  validateTime,
  validateGroupLink,
} = require("../utils/validators");

const abacusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
    validate: {
      validator: validateDate,
      message: "invalid start date",
    },
  },
  endDate: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: validateDate,
      message: "invalid end date",
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
  groupLink: {
    type: String,
    validate: {
      validator: validateGroupLink,
      message: "invalid group link",
    },
  },
  eventType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
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
    validate: {
      validator: validateMinTeamSize,
      message: "invalid min team size",
    },
  },
  maxTeamSize: {
    type: Number,
    validate: {
      validator: validateMaxTeamSize,
      message: "invalid min or max team sizes",
    },
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
