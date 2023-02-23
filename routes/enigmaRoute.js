const express = require("express");
const router = express.Router();
const { enigmaRegister } = require("../controllers/enigmaController");

router.post("/Register", enigmaRegister);

module.exports = router;
