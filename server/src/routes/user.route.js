const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getMe,
  getUserById,
  addUser,
} = require("../controllers/user.controller.js");
const upload = require("../middlewares/upload.middleware.js");
const verifyToken = require("../middlewares/auth.middleware.js");

const userRouter = express.Router();

userRouter.route("/register").post(upload.single("avatar"), registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(verifyToken, logoutUser);
userRouter.route("/me").get(verifyToken, getMe);
userRouter.route("/all").get(verifyToken, getAllUsers);
userRouter
  .route("/admin/create")
  .post(verifyToken, upload.single("avatar"), addUser);
userRouter
  .route("/update/:userId")
  .put(verifyToken, upload.single("avatar"), updateUser);
userRouter.route("/delete/:userId").delete(verifyToken, deleteUser);
userRouter.route("/:userId").get(verifyToken, getUserById);
module.exports = userRouter;
