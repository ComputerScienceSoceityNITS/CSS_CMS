const express = require("express");
const { addAdmin, login, logout } = require("../controllers/admin");
const router = express.Router();

/* No need to use this Route, admin is already created*/
//router.route("/register").post(addAdmin);

router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
