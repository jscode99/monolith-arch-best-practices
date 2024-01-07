const path = require("path");
const winston = require("winston");

const { loggers, transports, format } = winston;
const { combine, timestamp, json, prettyPrint } = format;

const errorFilter = format((info, opts) => {
  return info.level === "error" ? info : false;
});

const infoFilter = format((info, opts) => {
  return info.level === "info" ? info : false;
});

loggers.add("UserLogger", {
  level: "debug",
  format: combine(
    timestamp({
      format: "DD-MM-YYYY hh:mm:ss.SSS A",
    }),
    json(),
    prettyPrint(),
  ),
  defaultMeta: { service: "UserService" },
  transports: [
    new transports.Console(),
    new transports.File({
      level: "error",
      dirname: path.resolve(__dirname, "../../user-logs"),
      filename: "user_service_error_logs.log",
      format: combine(errorFilter()),
    }),
    new transports.File({
      level: "info",
      dirname: path.resolve(__dirname, "../../user-logs"),
      filename: "user_service_info_logs.log",
      format: combine(infoFilter()),
    }),
  ],
});

loggers.add("CourseLogger", {
  level: "debug",
  format: combine(
    timestamp({
      format: "DD-MM-YYYY hh:mm:ss.SSS A",
    }),
    json(),
    prettyPrint(),
  ),
  defaultMeta: { service: "CourseService" },
  transports: [
    new transports.Console(),
    new transports.File({
      level: "error",
      dirname: path.resolve(__dirname, "../../course-logs"),
      filename: "course_service_error_logs.log",
      format: combine(errorFilter()),
    }),
    new transports.File({
      level: "info",
      dirname: path.resolve(__dirname, "../../course-logs"),
      filename: "course_service_info_logs.log",
      format: combine(infoFilter()),
    }),
  ],
});
