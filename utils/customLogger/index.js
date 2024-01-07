const path = require("path");
const winston = require("winston");
const { AppError } = require("../app-errors");
require("./logger-list");

const { createLogger, transports, format } = winston;
const { combine, timestamp, printf, json, colorize, align, prettyPrint } =
  format;

class CustomLogger {
  constructor() {
    // Custom levels
    // const logLevels = {
    //   fatal: 0,
    //   error: 1,
    //   warn: 2,
    //   info: 3,
    //   debug: 4,
    //   trace: 5,
    // };

    // this.logger = createLogger({
    //   // levels: logLevels,
    //   level: "debug",
    //   format: combine(
    //     // colorize({ all: true }), // To implement color in logging.
    //     timestamp({
    //       format: "DD-MM-YYYY hh:mm:ss.SSS A", // 06-01-2024 08:03:26.636 PM
    //     }),
    //     json(), // JSON format for logging
    //     // align(), // To align the log messages.
    //     // printf((info) => `${info.timestamp} ${info.level}: ${info.message}`), // Custom log formatting
    //     prettyPrint(), // A clean format for logging
    //   ),
    //   transports: [
    //     new transports.Console(), // Output the logs to console.
    //     new transports.File({
    //       dirname: path.resolve(__dirname, "../../logs"),
    //       filename: "all_logs.log",
    //     }),
    //     new transports.File({
    //       filename: "info_logs.log",
    //       level: "info",
    //       format: combine(infoFilter()),
    //       //  use a custom format on the transport to filter the messages by level.
    //     }),
    //     new transports.File({
    //       filename: "app_errors.log",
    //       level: "error",
    //       format: combine(errorFilter()),
    //     }),
    //   ],
    // });

    this.userLogger = winston.loggers.get("UserLogger");
    this.courseLogger = winston.loggers.get("CourseLogger");
  }

  // Private method
  _requestLogFormat(req) {
    const { method, body } = req;
    return {
      method: method,
      isAuthenticated: false,
      username: body.username,
    };
  }

  // Private method
  _logWithRequestInfo(req) {
    const logFormat = this._requestLogFormat(req);
    const childLogger = req.url.includes("/user")
      ? this.userLogger.child(logFormat)
      : this.courseLogger.child(logFormat);
    return childLogger;
  }

  async logInfo(req, message, additionalInfo) {
    const childLogger = this._logWithRequestInfo(req);
    console.log("==================== Start Info Logger ===============");
    childLogger.info(message, additionalInfo);
    console.log("==================== End Info Logger ===============");
  }

  async logError(req, message, additionalInfo) {
    const childLogger = this._logWithRequestInfo(req);
    console.log("==================== Start Error Logger ===============");
    childLogger.error(message, additionalInfo);
    console.log("==================== End Error Logger ===============");
  }
}

module.exports = CustomLogger;
