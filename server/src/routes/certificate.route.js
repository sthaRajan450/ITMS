const express = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const {
  assignCertificate,
  getMyCertificates,
  getAllCertificates,
} = require("../controllers/certificate.controller");
const upload = require("../middlewares/upload.middleware");

const certificateRouter = express.Router();

certificateRouter
  .route("/assign")
  .post(verifyToken, upload.single("certificate"), assignCertificate);
certificateRouter.route("/my").get(verifyToken, getMyCertificates);
certificateRouter.route("/all").get(verifyToken, getAllCertificates);
module.exports = certificateRouter;
