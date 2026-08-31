const express = require("express");

const { getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);

module.exports = router;
