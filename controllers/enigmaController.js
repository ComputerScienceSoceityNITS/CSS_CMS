const Users = require("../models/users");
const Enigma = require("../models/enigmaModel");
const { catchAsync } = require("../utils/errorHandler");

exports.getCodeforcesHandles = catchAsync(async (req, res, next) => {
  const users = await Users.find({
    codeforcesHandle: {
      $ne: null,
    },
  }).select("name scholarID codeforcesHandle");
  res.status(201).json({
    status: "success",
    users: users,
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const enigma_id = req.params.enigma_id;
  const event = await Enigma.findById(enigma_id);

  if (!event) {
    return res.status(400).json({
      status: "fail",
      message: `no event found with the given id: ${enigma_id}`,
    });
  }

  const user = await Users.findById(req.user._id);
  if (event.participants.find((id) => id.equals(user._id))) {
    return res.status(400).json({
      status: "fail",
      message: "user already registered for the event",
    });
  }

  event.participants = [...event.participants, user._id];
  user.registeredEnigmas = [...user.registeredEnigmas, event._id];
  await event.save();
  await user.save();

  res.status(200).json({
    status: "success",
    message: "user successfully registered",
  });
});

exports.getAllEnigmas = catchAsync(async (req, res, next) => {
  const enigmas = await Enigma.find();
  res.status(201).json({
    status: "success",
    enigmas,
  });
});

exports.createEnigma = catchAsync(async (req, res, next) => {
const { cfContestLink, startDate, startTime } = req.body;

  if (!(cfContestLink && startDate && startTime )) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all the details",
    });
  }

  const enigma = await Enigma({
    cfContestLink,
    startDate,
    startTime,
  }).save();

  res.status(201).json({
    status: "success",
    message: "Enigma Succesfully Created",
    enigma: enigma,
  });
});

exports.updateEnigma = catchAsync(async (req, res, next) => {
  const enigma_id = req.params.enigma_id;
  const enigma = await Enigma.findById(enigma_id);

  if (!enigma) {
    return res.status(400).json({ status: "fail", message: "No such enigma exists" });
  }
  const newBodyObj = req.body;
  Object.assign(enigma, newBodyObj);
  const updatedEvent = await enigma.save();

  res.status(200).json({ status: "success", message: "enigma successfully updated", enigma: updatedEvent });
});

exports.deleteEnigma = catchAsync(async (req, res, next) => {
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
    status: "success",
    message: "enigma deleted",
  });
});
