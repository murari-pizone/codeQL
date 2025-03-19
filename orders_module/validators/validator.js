const Joi = require('joi');

const orderSchema = Joi.object({
  order_id: Joi.number().integer().required(),
  status: Joi.string().valid('PICKEDUP', 'DELIVERED', 'CANCELLED').required(),
  timestamp: Joi.date().iso().required(), // Ensure the date is in ISO format
  de_details: Joi.object({
    name: Joi.string().min(1).required(),
    contact_number: Joi.string().length(10).pattern(/^\d+$/).optional(), // Ensure it's a 10-digit number
    alt_contact_number: Joi.string().length(10).pattern(/^\d+$/).optional(), // Optional field
  }).required(),
});

const orderRelaySchema = Joi.object({
  order_id: Joi.number().required().messages({
    'string.empty': 'Order_id does not exist 106',
    'any.required': 'Order_id is required 106',
    'number.base': 'Order_id must be a number 106',
  }),
  outlet_id: Joi.string().required().messages({
    'string.empty': 'Outlet_id does not exist 105',
    'any.required': 'Outlet_id is required 105',
  }),
  order_edit: Joi.boolean().required().error(new Error('Order_edit is required  108')),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required().messages({
          'string.empty': 'Item_id does not exist 131',
          'any.required': 'Item_id is required 131',
        }),
        price: Joi.number().required().error(new Error('Item_price mismatch 134')),
        final_sub_total: Joi.number().required().error(new Error(' total_price mismatch 138')),
        variants: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required().messages({
                'string.empty': 'Variant_id dose not exist 132',
                'any.required': 'Variant_id is required 132',
              }),
            }).unknown(true), // Allows other fields in each variant object
          )
          .optional(), // Allows variants array to be empty or absent
        addons: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().required().messages({
                'string.empty': 'addon_id dose not exist 133',
                'any.required': 'addon_id is required 133',
              }),
            }).unknown(true), // Allows other fields in each addon object quantity
          )
          .optional(), // Allows addons array to be empty or absent
      }).unknown(true), // Allows other fields in each item object
    )
    .optional(), // Allows items array to be empty or absent
}).unknown(true); // Allows other fields in the main object

// Function to validate Aggregator
exports.orderStatus = (detail) => {
  return orderSchema.validate(detail);
};
exports.orderRelayStatus = (detail) => {
  return orderRelaySchema.validate(detail);
};

const orderCancel = Joi.object({
  timestamp: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.base': 'Timestamp must be a string',
      'string.empty': 'Timestamp cannot be an empty string',
      'string.pattern.base': 'Timestamp must be in a valid date format',
      'any.required': 'Timestamp is required',
    }),

  cancellation_reason: Joi.string().required().messages({
    'string.pattern.base': 'Please provide a valid cancellation reason. This field cannot be left blank.',
    'string.empty': 'Cancellation reason cannot be an empty string',
    'any.required': 'Cancellation reason is required',
  }),

  food_prepared_status: Joi.boolean()
    .valid(false) // Only allows the value 'true'
    .required() // Makes the field required
    .messages({
      'any.required': 'Food prepared status is required ', // When the field is missing
      'boolean.base': 'Food prepared status must be a boolean', // When the value is not a boolean
      'any.only': 'After food is prepared, the order cannot be canceled.', // When the value is not 'true'
    }),

  swiggy_order_id: Joi.number()
    .integer() // Ensures the value is an integer
    .required() // Makes the field required
    .messages({
      'number.base': 'Order ID must be a number', // When the value is not a number
      'number.integer': 'Order ID must be an integer', // When the number is not an integer
      'any.required': 'Order ID is required', // When the field is missing or undefined
    }),

  external_order_id: Joi.string().required().messages({
    'string.pattern.base': 'External Order ID must be a number',
    'any.required': 'External_Order_ID is required',
  }),
});

exports.orderCancelStatus = (detail) => {
  return orderCancel.validate(detail);
};

exports.orderRelayStatus = (detail) => {
  return orderRelaySchema.validate(detail);
};

const orderDeliveryStatus = Joi.object({
  status: Joi.string()
    .valid('CONFIRMED', 'CANCELLED', 'DELIVERED', 'PICKEDUP', 'ARRIVED') // Allow only specific values
    .required() // Make it required
    .messages({
      'string.base': 'Status must be a string', // For any non-string value
      'string.empty': 'Status cannot be empty', // If the string is empty
      'any.required': 'Status is required', // If the status is missing
      'any.only': 'Status must be one of the following values:CONFIRMED, CANCELLED, DELIVERED, PICKEDUP, ARRIVED', // For invalid values
    }),

  order_id: Joi.number()
    .integer() // Ensures the value is an integer
    .required() // Makes the field required
    .messages({
      'number.base': 'Order ID must be a number', // When the value is not a number
      'number.integer': 'Order ID must be an integer', // When the number is not an integer
      'any.required': 'Order ID is required', // When the field is missing or undefined
    })
    .error(new Error('Order_ID does not exist ')),
  timestamp: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    .required()
    .messages({
      'string.base': 'Timestamp must be a string',
      'string.empty': 'Timestamp cannot be an empty string',
      'string.pattern.base': 'Timestamp must be in a valid date format',
      'any.required': 'Timestamp is required',
    }),
  de_details: Joi.object({
    name: Joi.string().required().messages({
      'string.pattern.base': 'Name must be a string',
      'string.empty': 'Name cannot be an empty string',
      'any.required': 'Name is required',
    }),
    contact_number: Joi.string().required().messages({
      'string.pattern.base': 'Contact_number must be a string',
      'string.empty': 'Contact_number cannot be an empty string',
      'any.required': 'Contact_number is required',
    }),
    alt_contact_number: Joi.string().required().messages({
      'string.pattern.base': 'Alt_contact_number must be a string',
      'string.empty': 'Alt_contact_number cannot be an empty string',
      'any.required': 'Alt_contact_number is required',
    }),
  })
    .required()
    .messages({
      'any.required': 'De_details is required',
    }),
});

exports.orderDeliveryStatus = (detail) => {
  return orderDeliveryStatus.validate(detail);
};

// const confirmSchema = Joi.object({
//   timestamp: Joi.string().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
//     .required()
//     .message('timestamp is required and must follow the format YYYY-MM-DD HH:MM:SS'),

//   timestamp_outlet: Joi.string().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
//     .optional(), // Optional field, if it exists, it must follow the same format

//   swiggy_order_id: Joi.number().integer().required()
//     .message('swiggy_order_id is required and must be a valid integer'),

//   external_order_id: Joi.string().alphanum().required()
//     .message('external_order_id is required and must be a non-empty alphanumeric string'),

//   description: Joi.string().optional(), // Optional field

//   metadata: Joi.object({
//     xyz: Joi.string().optional() // Optional field inside metadata
//   }).optional() // metadata itself is optional
// });

// exports.orderConfirm = (detail) => {
//   return confirmSchema.validate(detail);
// };

// const Joi = require('joi');  // Assuming you are using Joi for validation

const orderMFRschema = Joi.object({
  timestamp: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/) // Matches the pattern "YYYY-MM-DD HH:mm:ss"
    .required()
    .messages({
      'string.pattern.base': '"timestamp" must be in the format "YYYY-MM-DD HH:mm:ss"',
      'any.required': '"timestamp" is required',
    }),

  swiggy_order_id: Joi.number().integer().positive().required().messages({
    'number.base': '"swiggy_order_id" must be a number',
    'number.integer': 'swiggyOrderId : may not be null',
    'number.positive': '"swiggy_order_id" must be a positive integer',
    'any.required': '"swiggy_order_id" is required',
  }),

  external_order_id: Joi.string().alphanum().required().messages({
    'string.base': '"external_order_id" must be a string',
    'string.alphanum': '"external_order_id" must be alphanumeric',
    'any.required': '"external_order_id" is required',
  }),

  description: Joi.string()
    .optional() // Optional field, if provided it must be a string
    .messages({
      'string.base': '"description" must be a string',
    }),

  metadata: Joi.object()
    .optional() // Optional field, if provided it must be an object
    .messages({
      'object.base': '"metadata" must be an object',
    }),
});

// Make sure `exports.order` exists before adding properties
if (!exports.order) {
  exports.order = {}; // Initialize `exports.order` if it doesn't exist
}

exports.orderMFRStatus = (detail) => {
  return orderMFRschema.validate(detail);
};

const orderTimeschema = Joi.object({
  orderId: Joi.number().integer().positive().required().messages({
    'number.base': '"Order_id" must be a number',
    'number.integer': '"Order_id" must be an integer',
    'number.positive': '"Order_id" must be a positive integer',
    'any.required': '"Order_id" is required',
  }),
});

exports.orderTimeStatus = (detail) => {
  return orderTimeschema.validate(detail);
};
