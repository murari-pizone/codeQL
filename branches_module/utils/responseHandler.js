/**
 * Utility module for handling API responses.
 * Provides standardized success and error response formats.
 */

module.exports = {
  /**
   * Sends a success response with a given message and optional data.
   *
   * @param {object} res - Express response object.
   * @param {string} message - Success message.
   * @param {object} [data={}] - Additional data to send in the response.
   * @returns {object} - JSON response with status 200.
   */
  successResponse: (res, message, data = {}) => res.status(200).json({ success: true, message, data }),

  /**
   * Sends an error response with a given message and status code.
   *
   * @param {object} res - Express response object.
   * @param {string} message - Error message.
   * @param {number} [statusCode=500] - HTTP status code (default is 500 for server errors).
   * @returns {object} - JSON response with the specified error status.
   */
  errorResponse: (res, message, statusCode = 500) => res.status(statusCode).json({ success: false, message }),
};
