const express = require("express");
const router = express.Router();
const { login, signUp, logout } = require("../controllers/userController");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
