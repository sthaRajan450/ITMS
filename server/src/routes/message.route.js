const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const {
  sendMessage,
  getUserMessages,
} = require("../controllers/message.controller");
const messageRouter = express.Router();
messageRouter.route("/send").post(verifyToken, sendMessage);
messageRouter.route("/inbox/:userId").get(verifyToken, getUserMessages);

module.exports = messageRouter;
