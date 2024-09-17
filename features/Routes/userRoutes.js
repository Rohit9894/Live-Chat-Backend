const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../../Controllers/userControllers");
const router = express.Router();
router.route("/signup").post(registerUser);
router.route("/login").post(authUser);
router.route("/allUser").get(protect, allUsers);
module.exports = router;
