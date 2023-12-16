const express = require("express");
const router = express.Router();
const {
  getCodeforcesHandles,
  getAllEnigmas,
  createEnigma,
  updateEnigma,
  deleteEnigma,
  register,
} = require("../controllers/enigmaController");
const { isAdmin } = require("../controllers/admin");
const { authenticate } = require("../controllers/userController");

// open routes
router.get("/cfID", getCodeforcesHandles);
router.get("/", getAllEnigmas);

// registered user routes
router.post("/register/:enigma_id", authenticate, register);

// protected routes
router.post("/", createEnigma);
router.patch("/:enigma_id", isAdmin,  updateEnigma);
router.delete("/:enigma_id", isAdmin, deleteEnigma);

module.exports = router;
