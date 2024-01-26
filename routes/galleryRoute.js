const express = require("express");
const router = express.Router();

const {
  getImages,
  uploadImage,
  deleteImage,
} = require("../controllers/galleryController");
// const { isAdmin } = require("../controllers/admin");

// open routes
router.get("/", getImages);

// protected routes
router.post("/", uploadImage);
router.delete("/", deleteImage);

module.exports = router;