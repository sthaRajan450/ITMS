const express = require("express");
const {
  sendApplicationDecisionEmail,
} = require("../controllers/mail.controller");
const mailRouter = express.Router();

// POST route to send decision email
mailRouter.route("/application-decision").post(sendApplicationDecisionEmail);

module.exports = mailRouter;
