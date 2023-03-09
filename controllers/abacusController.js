const Abacus = require("../models/abacus");
const Team = require("../models/teamModel");
const User = require("../models/users");
const cloudinary = require("cloudinary");
const { catchAsync } = require("../utils/errorHandler");

exports.getAllAbacusEvents = catchAsync(async (req, res, next) => {
  const abacusEvents = await Abacus.find().populate({
    path: "teams",
    select: "-__v",
    populate: {
      path: "members teamLeader",
      select: "name scholarID -_id",
    },
  });
  return res.status(201).json({
    status: "success",
    events: abacusEvents,
  });
});

exports.register = catchAsync(async (req, res, next) => {
  const event_id = req.params.event_id;
  const event = await Abacus.findById(event_id);
  const participants = event.participants;

  if (!event) {
    return res.status(404).json({
      status: `fail`,
      message: `no event found with given id: ${event_id}`,
    });
  }

  let { teamName, teamLeaderScholarID, memberScholarIDs } = req.body;
  memberScholarIDs = memberScholarIDs || [];

  if (!(teamName && teamLeaderScholarID)) {
    return res.status(400).json({
      status: "fail",
      message: "please provide all required fields",
    });
  }

  // push team leader to the list of members
  memberScholarIDs.push(teamLeaderScholarID);

  if (memberScholarIDs.length < event.minTeamSize || memberScholarIDs.length > event.maxTeamSize) {
    return res.status(400).json({
      status: "fail",
      message: `number of members must be between ${event.minTeamSize} and ${event.maxTeamSize} (inclusive)`,
    });
  }

  if (!memberScholarIDs.find((scholarID) => scholarID === req.user.scholarID)) {
    return res.status(400).json({
      status: "fail",
      message: "signed-in user must be included in the team",
    });
  }

  // to store all retrieved documents
  const teamMembers = [];

  // verify if all scholar ids are registered and not repeated
  for (let scholarID of memberScholarIDs) {
    scholarID = scholarID.trim();

    const member = await User.findOne({ scholarID: scholarID });

    if (!member) {
      return res.status(400).json({
        status: "fail",
        message: `user with scholar id : ${scholarID} not found`,
      });
    }

    if (participants.find((id) => id === scholarID)) {
      return res.status(400).json({
        status: "fail",
        message: "one or more participants has already registered for the requested event",
      });
    }

    participants.push(member.scholarID);
    teamMembers.push(member);
  }

  // add current event id to user's list of registered events
  for (let member of teamMembers) {
    member.registeredAbacusEvents.push(event._id);
    await member.save();
  }

  // remove teamLeader from members list
  const teamLeader = teamMembers.pop();

  const team = await Team.create({
    name: teamName,
    teamLeader: teamLeader,
    members: teamMembers,
  });

  // add new participants to event document
  event.teams = [...event.teams, team];
  event.participants = participants;
  await event.save();

  const createdTeam = await Team.findById(team).populate({
    path: "members teamLeader",
    select: "name scholarID",
  });

  res.status(201).json({
    status: "success",
    message: "team successfully created",
    team: createdTeam,
  });
});

exports.createAbacusEvent = catchAsync(async (req, res) => {
  const { name, description, startDate, endDate, startTime, groupLink, eventType, minTeamSize, maxTeamSize } = req.body;

  let myCloud = {
    public_id: null,
    url: null,
  };

  if (req.files?.coverPic?.tempFilePath) {
    myCloud = await cloudinary.v2.uploader.upload(req.files.coverPic.tempFilePath, {
      folder: "abacus",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
    });
  }

  if (!name || !description || !startDate || !endDate || !eventType || !minTeamSize || !maxTeamSize || !startTime) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all the details",
    });
  }

  const event = await Abacus({
    name,
    description,
    startDate,
    endDate,
    eventType,
    minTeamSize,
    maxTeamSize,
    startTime,
    groupLink: groupLink || null,
    coverPic: {
      public_id: myCloud.public_id,
      url: myCloud.url,
    },
  }).save();

  return res.status(200).json({ status: "success", message: "Event Succesfully Created", event: event });
});

exports.updateAbacusEvent = catchAsync(async (req, res) => {
  const id = req.params.event_id;
  const event = await Abacus.findById(id);

  if (!event) {
    return res.status(400).json({
      status: "fail",
      message: "No such event exists",
    });
  }

  if (req.files) {
    const imageId = event.coverPic.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.files.coverPic.tempFilePath, {
      folder: "abacus",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      cloud_name: process.env.CLOUDINARY_NAME,
    });
    newBodyObj["coverPic"] = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const { name, description, startDate, endDate, startTime, groupLink, eventType, minTeamSize, maxTeamSize } = req.body;

  const updatedEvent = {
    name: name || event.name,
    description: description || event.description,
    startDate: startDate || event.startDate,
    endDate: endDate || event.endDate,
    startTime: startTime || event.startTime,
    groupLink: groupLink || event.groupLink,
    eventType: eventType || event.eventType,
    minTeamSize: minTeamSize || event.minTeamSize,
    maxTeamSize: maxTeamSize || event.maxTeamSize,
  };

  Object.assign(event, updatedEvent);
  await event.save();

  res.status(200).json({ status: "success", message: "event successfully updated", event: updatedEvent });
});
