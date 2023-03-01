const express = require("express");
const router = express.Router();

const {
  register,
  createAbacusEvent,
  updateAbacusEvent,
  getAllAbacusEvents,
} = require("../controllers/abacusController");

router.get("/", getAllAbacusEvents);
router.post("/register/:event_id", register);
router.post("/", createAbacusEvent);
router.patch("/:event_id", updateAbacusEvent);

module.exports = router;
