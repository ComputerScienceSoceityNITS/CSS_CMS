const express = require("express");
const router = express.Router();
const {
  getCodeforcesHandlers,
  getAllEnigmas,
  createEnigma,
  updateEnigma,
  deleteEnigma,
} = require("../controllers/enigmaController");

router.get("/cfID", getCodeforcesHandlers);
router.get("/getAllEnigmas", getAllEnigmas);
router.post("/createEnigma", createEnigma);
router.post("/updateEnigma", updateEnigma);
router.delete("/deleteEnigma", deleteEnigma);
//router.route("/deleteEnigma").delete(deleteEnigma);
module.exports = router;
