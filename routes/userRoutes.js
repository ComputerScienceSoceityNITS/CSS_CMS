const express = require("express");
const router = express.Router();
const { login, signUp, logout, getUser, authenticate } = require("../controllers/userController");

router.get("/", authenticate, getUser);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
