const Joi = require('joi');

const syncMenu = Joi.object({
  ShopCode: Joi.string().max(255).required(),
  Region: Joi.string().max(255).required(),
  aggregator_name: Joi.string().max(255).required(),
});
exports.validateSyncMenu = (password) => {
  return syncMenu.validate(password);
};

const getMenu = Joi.object({
  ShopCode: Joi.string().required().messages({
    'string.empty': 'ShopCode does not exist 105',
    'any.required': 'ShopCode is required 105',
  }),
});
exports.validateGetMenu = (password) => {
  return getMenu.validate(password);
};
