const express = require('express');
const { isAuthenticatedUser } = require('../controllers/admin');
const router = express.Router();
const { getAllEvents, createEvent, getEventDetails, updateEvent, deleteEvent } = require('../controllers/eventController');


router.route("/events").get(getAllEvents);
router.route("/event/new").post(isAuthenticatedUser, createEvent);
router.route("/event/:id").get(getEventDetails).put(isAuthenticatedUser, updateEvent).delete(isAuthenticatedUser, deleteEvent)


module.exports = router;