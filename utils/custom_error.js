const logger = require('./logger');

// Custom Error wrapper
class CustomError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // log the error
    logger.error({
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      stack: this.stack,
    });
  }
}

module.exports = { CustomError };
// example of how this can be used
// throw new CustomError(500, "Internal Server Error", ["Database connection failed"], "stack trace string here");
