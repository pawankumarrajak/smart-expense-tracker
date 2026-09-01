const express = require("express");

const {
  getProfile,
  updateProfile
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const {
  uploadProfilePicture
} = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);

router.put(
  "/profile",
  uploadProfilePicture,
  updateProfile
);

module.exports = router;