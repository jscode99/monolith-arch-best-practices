const winston = require("winston");
const { AppError } = require("./app-errors");

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

    const errorFilter = winston.format((info, opts) => {
      return info.level === "error" ? info : false;
    });

    const infoFilter = winston.format((info, opts) => {
      return info.level === "info" ? info : false;
    });

    const httpFilter = winston.format((info, opt) => {
      return info.level === "http" ? info : false;
    });

    this.logger = createLogger({
      // levels: logLevels,
      level: "debug",
      format: combine(
        // colorize({ all: true }), // To implement color in logging.
        timestamp({
          format: "DD-MM-YYYY hh:mm:ss.SSS A", // 06-01-2024 08:03:26.636 PM
        }),
        json(), // JSON format for logging
        // align(), // To align the log messages.
        // printf((info) => `${info.timestamp} ${info.level}: ${info.message}`), // Custom log formatting
        prettyPrint(), // A clean format for logging
      ),
      transports: [
        new transports.Console(), // Output the logs to console.
        new transports.File({
          filename: "all_logs.log",
          format: combine(errorFilter(), timestamp(), json(), prettyPrint()),
        }),
        new transports.File({
          filename: "info-log.log",
          level: "info",
          format: combine(infoFilter(), timestamp(), json(), prettyPrint()), //  use a custom format on the transport to filter the messages by level.
        }),
        new transports.File({
          filename: "app_errors.log",
          level: "error",
          format: combine(errorFilter(), timestamp(), json(), prettyPrint()),
        }),
        new transports.File({
          filename: "http_logs.log",
          level: "http",
          format: combine(httpFilter(), timestamp(), json(), prettyPrint()),
        }),
      ],
    });
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
    const childLogger = this.logger.child(logFormat);
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

  async logHttp(req, message, additionalInfo) {
    const childLogger = this._logWithRequestInfo(req);
    console.log("==================== Start HTTP Logger ===============");
    childLogger.http(message, additionalInfo);
    console.log("==================== End HTTP Logger ===============");
  }
}

module.exports = CustomLogger;
