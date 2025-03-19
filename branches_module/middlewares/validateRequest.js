/**
 * Middleware for validating request body using Joi schema.
 * If validation fails, it returns a 400 response with error details.
 * If validation succeeds, it passes the request to the next middleware/controller.
 *
 * @param {Object} schema - Joi validation schema.
 * @returns {Function} Express middleware function.
 */
module.exports = (schema) => (req, res, next) => {
  // Validate request body against the provided schema
  const { error } = schema.validate(req.body, { abortEarly: false });

  // If validation fails, return a 400 Bad Request response with error details
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: error.details,
    });
  }

  // Proceed to the next middleware/controller if validation passes
  next();
};
