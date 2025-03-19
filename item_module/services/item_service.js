const itemModule = require('../models/item_model');

class ItemService {
  constructor(logger) {
    this.logger = logger;
    this.model = new itemModule(logger);
  }

  async itemToggle(data) {
    return this.processItem('itemToggle', data);
  }

  async processItem(action, data) {
    try {
      return new Promise((resolve, reject) => {
        this.model[action](data, (err, result) => {
          if (err) {
            if (err instanceof Error) {
              this.logger.error(`Error Occured in Item_service for ${action} function1`, { err: err.message });
              reject(err);
            } else if (typeof err === 'object') {
              this.logger.error(`Error Occured in Item_service for ${action} function2`, { err: err.message });
              reject(new Error(err.message));
            } else {
              this.logger.error(`Error Occured in Item_service for ${action} function3`, { err: err.message });
              reject(new Error(err.message));
            }
          } else {
            this.logger.info(`--- Item_service for ${action} function executed successfully ----`, { req: result });
            resolve(result);
          }
        });
      });
    } catch (err) {
      this.logger.error('Error while In Item_service.js', { err: err });
      throw new Error(err);
    }
  }
}
module.exports = ItemService;
