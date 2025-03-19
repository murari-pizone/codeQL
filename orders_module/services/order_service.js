const orderModel = require('../models/order_model');
const logger = require('../../utils/logger');

class OrderService {
  constructor() {
    this.model = new orderModel();
    this.logger = logger;
  }
  // calling model for every service function
  async processOrder(action, data) {
    try {
      return new Promise((resolve, reject) => {
        this.model[action](data, (err, result) => {
          if (err) {
            if (err instanceof Error) {
              this.logger.error(`Error Occured in Order_service for ${action} function1`, { err: err.message });
              reject(err);
            } else if (typeof err === 'object') {
              this.logger.error(`Error Occured in Order_service for ${action} function2`, { err: err.message });
              reject(new Error(err.message));
            } else {
              this.logger.error(`Error Occured in Order_service for ${action} function3`, { err: err.message });
              reject(new Error(err.message));
            }
          } else {
            this.logger.info(`--- Order_service for ${action} function executed successfully ----`, { req: result });
            resolve(result);
          }
        });
      });
    } catch (err) {
      this.logger.error('Error while In Order_Service.js', { err: err });
      throw new Error(err);
    }
  }

  async orderConfirm(data) {
    return this.processOrder('orderConfirm', data);
  }

  async orderMFR(data) {
    return this.processOrder('orderMFR', data);
  }

  async orderTime(data) {
    return this.processOrder('orderTime', data);
  }

  async getOrders(data) {
    return this.processOrder('getOrders', data);
  }

  async pushOrder(data) {
    return this.processOrder('pushOrder', data);
  }

  async orderCancel(data) {
    return this.processOrder('orderCancel', data);
  }

  async orderCreate(data) {
    return this.processOrder('orderCreate', data);
  }

  async insertItem(data) {
    return this.processOrder('itemCreate', data);
  }

  async orderEdit(data) {
    return this.processOrder('orderEdit', data);
  }

  async deliveryStatus(data) {
    return this.processOrder('deliveryStatus', data);
  }
}

module.exports = OrderService;
