const Joi = require('joi');

// Define the schema
const storeToggleSchema = Joi.object({
  partnerid: Joi.string().required().messages({
    'string.empty': 'externalRestaurantId : may not be empty',
    'string.base': 'externalRestaurantId : must  be a string',
    'any.required': 'partnerid is required',
  }),

  isRequestedToOpen: Joi.boolean().required().messages({
    'boolean.base': 'isRequestedToOpen must be a boolean',
    'any.required': 'isRequestedToOpen is required',
  }),

  fromTime: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/) // Matches the pattern "YYYY-MM-DD HH:mm:ss"
    .optional()
    .messages({
      'string.base': 'fromTime must be a string',
      'string.pattern.base': '"fromTime" must follow the format "YYYY-MM-DD HH:mm:ss"',
    }),

  toTime: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/) // Matches the pattern "YYYY-MM-DD HH:mm:ss"
    .optional()
    .messages({
      'string.base': 'toTime must be a string',
      'string.pattern.base': 'toTime must follow the format "YYYY-MM-DD HH:mm:ss"',
    }),
});

exports.storeToggleStatus = (detail) => {
  return storeToggleSchema.validate(detail);
};
const slotSchema = Joi.object({
  open_time: Joi.string()
    .length(4) // Ensures that the string is exactly 4 characters
    .pattern(/^[0-2]\d[0-5]\d$/)
    .custom((value, helpers) => {
      // Validate that open_time is between 0000 and 2359
      const time = parseInt(value, 10);
      if (time < 0 || time > 2359) {
        return helpers.message('Open_time must be in 24 hour format in form of HHMM');
      }
      return value;
    })
    .required() // Makes the field required
    .messages({
      'string.pattern.base': 'Open_time must be in 24 hour format in form of HHMM',
      'string.empty': 'Open_time cannot be empty',
      'any.required': 'Open_time is required',
    }), // Ensure time is in HHMM format (4 digits)
  close_time: Joi.string()
    .length(4) // Ensures that the string is exactly 4 characters
    .pattern(/^[0-2]\d[0-5]\d$/) // Ensures it's in HHMM format, valid 24-hour time
    .custom((value, helpers) => {
      // Validate that open_time is between 0000 and 2359
      const time = parseInt(value, 10);
      if (time < 0 || time > 2359) {
        return helpers.message('close_time time must be in 24 hour format in form of HHMM');
      }
      return value;
    })
    .required() // Makes the field required
    .messages({
      'string.pattern.base': 'close_time must be in 24 hour format in form of HHMM',
      'string.empty': 'close_time cannot be empty',
      'any.required': 'close_time is required',
    }), // Ensure time is in HHMM format (4 digits)
});

const storeTimingSchema = Joi.array()
  .items(
    Joi.object({
      day: Joi.string()
        .valid('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun') // Valid days of the week
        .required()
        .messages({
          'string.valid': 'Day value should be among Mon, Tue, Wed, Thu, Fri, Sat, Sun',
          'any.required': 'Input size cannot be empty',
          'string.empty': 'Input size cannot be empty',
        }),

      slots: Joi.array()
        .items(slotSchema) // Ensure the array contains valid slots
        .min(1) // Ensure the array has at least 1 item
        .required() // Ensure the array itself is required
        .messages({
          'array.min': 'Input size cannot be empty', // Error if the array is empty
          'any.required': 'Input size cannot be empty',
        }),
    }),
  )
  .min(1) // Ensure the outer array has at least 1 item
  .required() // Ensure the array itself is required
  .messages({
    'array.min': 'Input size cannot be empty', // Adjust the message for empty array
    'any.required': 'Internal Error', // Adjust the message for missing input
  })
  .custom((value, helpers) => {
    // Check for duplicate days
    const days = value.map((item) => item.day);
    const uniqueDays = new Set(days);

    if (uniqueDays.size !== days.length) {
      return helpers.message('Day values cannot be duplicated.');
    }

    return value; // Return the value as is if no duplicates
  });

exports.storeTimingStatus = (detail) => {
  return storeTimingSchema.validate(detail);
};
