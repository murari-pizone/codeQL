const logger = require('../../utils/logger');
const ERPModel = require('../models/erp_model');
exports.pushOrder = async (orderData, callback) => {
  try {
    // Log when the pushOrder function is called
    logger.info('--- Received request to push order ----', {
      orderId: orderData?.order_id,
      orderData,
    });

    const orderService = new ERPModel(orderData);

    // Log before calling pushOrder method of OrderModel
    logger.info('Calling pushOrder method on OrderModel...', {
      orderId: orderData?.order_id,
    });

    await orderService.pushOrder(callback);

    // Log success after the order is pushed successfully
    logger.info('Successfully pushed order to ERP', {
      orderId: orderData?.order_id,
    });
  } catch (error) {
    // Log any errors that occur while processing
    logger.error('Error in pushOrder function', {
      error: error.message,
      stack: error.stack,
      orderId: orderData?.order_id,
    });
    callback(error);
  }
};
