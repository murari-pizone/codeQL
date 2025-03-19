/**
 * Validation schema for store branch requests.
 * Uses Joi for request body validation.
 */

const Joi = require('joi');

const storeBranchSchema = Joi.object({
  /**
   * Branch name - required field.
   */
  brname: Joi.string().required().messages({
    'any.required': 'Branch name is required.',
    'string.empty': 'Branch name cannot be empty.',
  }),

  /**
   * Location - required field.
   */
  location: Joi.string().required().messages({
    'any.required': 'Location is required.',
    'string.empty': 'Location cannot be empty.',
  }),

  /**
   * City - required field.
   */
  city: Joi.string().required().messages({
    'any.required': 'City is required.',
    'string.empty': 'City cannot be empty.',
  }),

  /**
   * State - required field.
   */
  state: Joi.string().required().messages({
    'any.required': 'State is required.',
    'string.empty': 'State cannot be empty.',
  }),

  /**
   * Region - required field.
   */
  region: Joi.string().required().messages({
    'any.required': 'Region is required.',
    'string.empty': 'Region cannot be empty.',
  }),

  /**
   * Reason for disabled - optional field.
   */
  reasonfordisabled: Joi.string().allow(null, '').optional(),

  /**
   * Enable/Disable Time - optional field, expects a date.
   */
  enaDisTime: Joi.date().allow(null).optional(),

  /**
   * Enable/Disable User - optional field.
   */
  enaDisUsr: Joi.string().allow(null, '').optional(),
});

module.exports = { storeBranchSchema };
