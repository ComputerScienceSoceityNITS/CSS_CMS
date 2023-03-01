const Users = require("../models/users");
const Enigma = require("../models/enigmaModel");

exports.getCodeforcesHandles = async (req, res, next) => {
  try {
    const users = await Users.find({
      codeforcesHandle: {
        $ne: null,
      },
    }).select("name scholarID codeforcesHandle");
    res.status(201).json({
      status: "success",
      users: users,
    });
  } catch (err) {
    res.send(err.message);
  }
};

exports.getAllEnigmas = async (req, res, next) => {
  try {
    const enigmas = await Enigma.find();
    res.status(201).json({
      status: "success",
      enigmas,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: `something went wrong: ${err.name}`,
    });
  }
};

exports.createEnigma = async (req, res, next) => {
  try {
    const { cfContestLink, start, durationInHrs, questionSetters, questionTesters } = req.body;

    if (!(cfContestLink && start && durationInHrs)) {
      return res.status(400).json({ status: "fail", message: "Please provide all the details" });
    }

    const startDate = new Date(start);

    const enigma = await Enigma({
      cfContestLink,
      start: startDate,
      durationInHrs,
      questionSetters: questionSetters || [],
      questionTesters: questionTesters || [],
    }).save();

    res.status(200).json({ status: "success", message: "Enigma Succesfully Created", enigma: enigma });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: "error", message: `something went wrong: ${e.name}` });
  }
};

exports.updateEnigma = async (req, res) => {
  try {
    const enigma_id = req.params.enigma_id;
    const enigma = await Enigma.findById(enigma_id);

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
    const enigma_id = req.params.enigma_id;
    const enigma = await Enigma.findById(enigma_id);
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