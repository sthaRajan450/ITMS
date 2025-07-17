const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRouter = require("./routes/user.route");
const courseRouter = require("./routes/course.route");
const blogRouter = require("./routes/blog.route");
const jobRouter = require("./routes/job.route");

const orderRouter = require("./routes/order.route");
const messageRouter = require("./routes/message.route");
const resourceRouter = require("./routes/resource.route");
const assignmentRouter = require("./routes/assignment.route");
app.use(
  cors({
    // Allow requests from the specified origin
    
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/assignment", assignmentRouter);
module.exports = app;
