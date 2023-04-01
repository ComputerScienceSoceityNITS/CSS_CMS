const express = require("express");
const router = express.Router();
const {
  login,
  signUp,
  logout,
  getUser,
  authenticate,
  updateProfile,
  resetPassword,
} = require("../controllers/userController");

router.get("/", authenticate, getUser);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/update", authenticate, updateProfile);
router.patch("/resetpassword", resetPassword);
router.get("/logout", logout);

module.exports = router;
