const express = require("express");
const router = express.Router();
const {
  getCodeforcesHandles,
  getAllEnigmas,
  createEnigma,
  updateEnigma,
  deleteEnigma,
} = require("../controllers/enigmaController");

router.get("/cfID", getCodeforcesHandles);
router.get("/", getAllEnigmas);
router.post("/", createEnigma);
router.patch("/:enigma_id", updateEnigma);
router.delete("/:enigma_id", deleteEnigma);
module.exports = router;
