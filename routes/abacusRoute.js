const express = require("express");
const router = express.Router();

const {
  register,
  createAbacusEvent,
  updateAbacusEvent,
  getAllAbacusEvents,
} = require("../controllers/abacusController");
const { isAdmin } = require("../controllers/admin");
const { authenticate } = require("../controllers/userController");

// open routes
router.get("/", getAllAbacusEvents);

// registered user routes
router.post("/register/:event_id", authenticate, register);

// admin only routes
router.post("/", isAdmin, createAbacusEvent);
router.patch("/:event_id", isAdmin, updateAbacusEvent);

module.exports = router;
