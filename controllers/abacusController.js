const Abacus = require("../models/abacus");
const Team = require("../models/teamModel");
const User = require("../models/users");
const cloudinary = require("cloudinary");

exports.getAllAbacusEvents = async (req, res, next) => {
  try {
    const abacusEvents = await Abacus.find().populate({
      path: "teams",
      select: "-__v",
      populate: {
        path: "members",
        select: "name",
      },
    });
    return res.status(201).json({
      status: "success",
      events: abacusEvents,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: `something went wrong : ${err.name}`,
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const event_id = req.params.event_id;
    const event = await Abacus.findById(event_id);
    const registeredScholarIDs = event.participants;

    if (!event) {
      return res.status(404).json({
        status: `fail`,
        message: `no event found with given id: ${event_id}`,
      });
    }

    const { teamName, memberScholarIDs } = req.body;

    if (!(teamName && memberScholarIDs && memberScholarIDs.length >= 1)) {
      res.status(400).json({
        status: "fail",
        message: "please provide all required fields",
      });
    }

    if (memberScholarIDs.length < event.minTeamSize || memberScholarIDs.length > event.maxTeamSize) {
      return res.status(400).json({
        status: "fail",
        message: `number of members must be between ${event.minTeamSize} and ${event.maxTeamSize} (inclusive)`,
      });
    }

    const memberIDs = [];

    for (let scholarID of memberScholarIDs) {
      scholarID = scholarID.trim();
      if (registeredScholarIDs.find((id) => id === scholarID)) {
        return res.status(400).json({
          status: "fail",
          message: "one or more participants has already registered for the requested event",
        });
      }
      const user = await User.findOne({ scholarID: scholarID });

      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: `user with scholar id : ${scholarID} not found`,
        });
      }

      user.registeredAbacusEvents.push(event._id);
      await user.save();
      memberIDs.push(user._id);
      registeredScholarIDs.push(scholarID);
    }

    const team = await Team.create({
      name: teamName,
      members: memberIDs,
    });

    event.teams = [...event.teams, team];
    event.participants = registeredScholarIDs;

    await event.save();

    const createdTeam = await Team.findById(team).populate({
      path: "members",
      select: "name scholarID",
    });

    res.status(201).json({
      status: "success",
      message: "team successfully created",
      team: createdTeam,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: `error`,
      message: `something went wrong: ${err.name}`,
    });
  }
};

exports.createAbacusEvent = async (req, res) => {
  try {
    const { name, description, startDate, endDate, startTime, groupLink, eventType, minTeamSize, maxTeamSize } =
      req.body;

    let myCloud = {
      public_id: null,
      url: null,
    };

    if (req.files?.coverPic?.tempFilePath) {
      myCloud = await cloudinary.v2.uploader.upload(req.files.coverPic.tempFilePath, {
        folder: "abacus",
        api_key:process.env.API_KEY,api_secret:process.env.API_SECRET,cloud_name: process.env.API_NAME
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
  } catch (e) {
    return res.status(500).json({ status: "error", message: `something went wrong: ${e}` });
  }
};

exports.updateAbacusEvent = async (req, res) => {
  try {
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
        api_key:process.env.API_KEY,api_secret:process.env.API_SECRET,cloud_name: process.env.API_NAME
      });
      newBodyObj["coverPic"] = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const { name, description, startDate, endDate, startTime, groupLink, eventType, minTeamSize, maxTeamSize } =
      req.body;

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
  } catch (e) {
    res.status(500).json({ status: "error", message: `Something went wrong : ${e}` });
  }
};
