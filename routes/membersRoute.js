const express = require('express');
const { isAuthenticatedUser } = require('../controllers/admin');
const { addMember, updateMember, deleteMember, getMembers } = require('../controllers/memberController');
const router = express.Router();


router.route("/member/new").post(isAuthenticatedUser, addMember);
router
  .route("/member/:id")
  .put(isAuthenticatedUser, updateMember)
  .delete(isAuthenticatedUser, deleteMember);
router.route("/members/:session").get(getMembers)

module.exports = router;
