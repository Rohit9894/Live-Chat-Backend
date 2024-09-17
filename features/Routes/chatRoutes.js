const express = require("express");
const router = express.Router();
const protect = require("../../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGropChat,
  renameGroup,
  addToGroup,
  removeToGroup,
} = require("../../Controllers/chatControllers");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGropChat);
router.route("/rename").put(protect, renameGroup);
router.route("/add").put(protect, addToGroup);
router.route("/remove").put(protect, removeToGroup);
module.exports = router;
