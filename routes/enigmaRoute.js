const express = require("express");
const router = express.Router();
const {
  getCodeforcesHandles,
  getAllEnigmas,
  createEnigma,
  updateEnigma,
  deleteEnigma,
} = require("../controllers/enigmaController");
const { isAdmin } = require("../controllers/admin");
const { authenticate } = require("../controllers/userController");

// open routes
router.get("/cfID", getCodeforcesHandles);
router.get("/", getAllEnigmas);

// protected routes
router.post("/", isAdmin, createEnigma);
router.patch("/:enigma_id", isAdmin, updateEnigma);
router.delete("/:enigma_id", isAdmin, deleteEnigma);

module.exports = router;
