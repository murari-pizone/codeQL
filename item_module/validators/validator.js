const Joi = require('joi');

// Define the schema
const itemToggleSchema = Joi.object({
  restaurantId: Joi.string().required().messages({
    'string.empty': 'restaurantId : may not be empty',
    'string.base': 'restaurantId : must be a string',
    'any.required': 'restaurantId is required',
  }),
  externalItemIds: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.base': 'externalItemIds should be an array of strings.',
    'array.includes': 'externalItemIds should only contain strings.',
    'any.required': 'externalItemIds is required',
  }),

  enable: Joi.boolean().required().messages({
    'boolean.base': 'enable must be a boolean',
    'any.required': 'enable is required',
  }),

  fromTime: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/) // Matches the pattern "YYYY-MM-DD HH:mm:ss"
    .optional()
    .messages({
      'string.base': 'fromTime must be a string',
      'string.pattern.base': 'fromTime must follow the format "YYYY-MM-DD HH:mm:ss"',
    }),

  toTime: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/) // Matches the pattern "YYYY-MM-DD HH:mm:ss"
    .optional()
    .messages({
      'string.base': 'toTime must be a string',
      'string.pattern.base': 'toTime must follow the format "YYYY-MM-DD HH:mm:ss"',
    }),
});

exports.itemToggleStatus = (detail) => {
  return itemToggleSchema.validate(detail);
};
