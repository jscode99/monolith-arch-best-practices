const express = require("express");
const cors = require("cors");
// Utils
const ErrorHandler = require("./utils/error-handler");
const { User, Mentor, courses } = require("./routes");

module.exports = async (app) => {
  app.use(express.json());
  app.use(cors());

  app.use("/user", User);

  app.use(ErrorHandler);
};
