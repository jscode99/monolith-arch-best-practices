const CustomLogger = require("./custom-logger");
const { STATUS_CODES, AppError } = require("./app-errors");

const logger = new CustomLogger();

class ErrorLog {
  constructor() {}
  async logError(req, err) {
    await logger.logError(req, err.message, {
      error_stack: err?.stack || "",
    });
    return false;
  }

  isTrustError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

const ErrorHandler = async (err, req, res, next) => {
  const errorLogger = new ErrorLog();

  if (err) {
    await errorLogger.logError(req, err);
    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDesc = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDesc });
      }
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res
      .status(err.statusCode || STATUS_CODES.INTERNAL_ERROR)
      .json({ message: err.message });
  }
  next();
};

module.exports = ErrorHandler;
