const Users = require("../models/users");
const enigmaModel = require("../models/enigmaModel");

exports.getCodeforcesHandlers = async (req, res, next) => {
  try {
    let allUsers = await Users.find();
    const cfIds = allUsers.filter((ele) => {
      return ele.codeforcesHandle !== null;
    });
    res.status(201).json({
      success: true,
      cfIds,
    });
  } catch (err) {
    res.send(err.message);
  }
};

exports.getAllEnigmas = async (req, res, next) => {
  try {
    const allEnigmas = await enigmaModel.find();
    res.status(201).json({
      success: true,
      allEnigmas,
    });
  } catch (err) {
    res.send(err.message);
  }
};

exports.createEnigma = async (req, res, next) => {
  try {
    const { cfContestLink, startDate, endDate } = req.body;
    if (!cfContestLink || !startDate || !endDate) {
      return res.status(400).json({ status: "fail", message: "Please provide all the details" });
    }

    const event = await enigmaModel({
      cfContestLink,
      startDate,
      endDate,
    }).save();

    res.status(200).json({ status: "success", message: "Enigma Succesfully Created", event: event });
  } catch (e) {
    res.status(500).json({ status: "error", message: `something went wrong: ${e}` });
  }
};

exports.updateEnigma = async (req, res) => {
  try {
    const enigma = await enigmaModel.findById(req.body.id);

    if (!enigma) {
      return res.status(400).json({ status: "fail", message: "No such enigma exists" });
    }
    const newBodyObj = req.body;
    Object.assign(enigma, newBodyObj);
    const updatedEvent = await enigma.save();

    res.status(200).json({ status: "success", message: "enigma successfully updated", enigma: updatedEvent });
  } catch (e) {
    res.status(500).json({ status: "error", message: `Something went wrong : ${e}` });
  }
};

exports.deleteEnigma = async (req, res, next) => {
  try {
    const enigma = await enigmaModel.findById(req.body.id);
    if (!enigma) {
      return res.status(500).json({
        success: false,
        message: "Enigma not found",
      });
    }
    await enigma.remove();

    res.status(200).json({
      success: true,
      message: "Enigma deleted",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: `Something went wrong : ${e}` });
  }
};
