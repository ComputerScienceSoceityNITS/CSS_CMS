const User = require("../models/users");
const eParticipant = require("../models/enigmaParticipantModel");

const enigmaRegister = async (req, res, next) => {
  try {
    if (!(req.body.scholarID >= 1)) {
      res.status(400).json({
        status: "fail",
        message: "please enter your scholarID",
      });
    }

    const user = await User.findOne({ scholarID: req.body.scholarID });
    if (!user) {
      return res.status(404).json({
        status: `fail`,
        message: `User does not exist`,
      });
    }

    const Reg = await eParticipant.create({
      participantID: user._id,
    });
    res.status(201).json({
      status: "success",
      message: "Registered Successfully",
      Participant: Reg,
    });
  } catch (err) {
    res.status(500).json({
      error: `Some error Occured: ${err.name}`,
    });
  }
};

module.exports = { enigmaRegister };
