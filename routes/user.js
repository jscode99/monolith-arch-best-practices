const express = require("express");
const router = express.Router();

// Middlewares
const { userAuth } = require("../middlewares/userAuth");

// Services
const UserService = require("../services/userService");

// Utils
const { ValidationError, STATUS_CODES } = require("../utils/app-errors");
const CustomLogger = require("../utils/custom-logger");

const userService = new UserService();
const logger = new CustomLogger();

const isValid = (req, res, next) => {
  if (!req.body.zipCode) {
    next(new ValidationError("Please include a valid zip code!!"));
  }
};

router
  .post("/signup", isValid, async function (req, res, next) {
    try {
      const { username, password, firstname, lastname } = req.body;
    } catch (err) {
      next(err);
    }
  })
  .post("/login", userAuth, async function (req, res) {
    const { username, password } = await userService.LogIn(req.body);
    res.send({ data: `Your user data - ${username} ${password}` });
  });

module.exports = router;
