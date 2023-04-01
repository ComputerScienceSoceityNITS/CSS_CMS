const express = require("express");
const router = express.Router();

const {
  register,
  createAbacusEvent,
  updateAbacusEvent,
  getAllAbacusEvents,
  deleteAbacusEvent,
  unregister,
} = require("../controllers/abacusController");
const { isAdmin } = require("../controllers/admin");
const { authenticate } = require("../controllers/userController");

// open routes
router.get("/", getAllAbacusEvents);

// registered user routes
router.post("/register/:event_id", authenticate, register);
router.post("/unregister/:event_id", authenticate, unregister);

// admin only routes
router.post("/", isAdmin, createAbacusEvent);
router.patch("/:event_id", isAdmin, updateAbacusEvent);
router.delete("/:event_id", isAdmin, deleteAbacusEvent);

module.exports = router;
