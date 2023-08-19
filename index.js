const express = require("express");
const moragan = require("morgan");
const dotenv = require("dotenv");
const createError = require("http-errors");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));
app.use(cors());

//routes
app.use("/api/user", require("./routes/userRoutes"));

//static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).send({
      type: "ValidationError",
      message: err.message,
      //details: error.details,
    });
  }
  if (err.name === "CastError") {
    return res.status(400).send({
      status: err.status,
      type: "CastError",
      message:
        err.message ||
        "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }

  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

//port
const port = process.env.PORT || 8080;
//listen port
app.listen(port, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});
