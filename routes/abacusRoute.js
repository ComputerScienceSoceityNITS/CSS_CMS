const express = require("express");
const router = express.Router();

const { register } = require("../controllers/abacusController");

router.post("/register/:event_id", register);

module.exports = router;
