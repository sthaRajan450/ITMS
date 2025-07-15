require("dotenv").config({
  path: "./.env",
});

const app = require("./app");
const connectDB = require("./db/index");

const port = process.env.PORT;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error:", error);
    });
    app.listen(port, () => {
      console.log(`Server is running at port:${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
