const itemService = require('../services/item_service');
const { orderConfirm } = require('../../common_module/common_response');
const ErrorMessage = require('../constant');

class ItemController {
  constructor(logger, validateItem) {
    this.validateItem = validateItem;
    this.logger = logger;
    this.itemService = new itemService(logger);
  }

  async itemToggle(req, res) {
    try {
      // Log the incoming request with relevant information for debugging
      this.logger.info('--- Received itemToggle request ----', {
        restaurantId: req?.body?.restaurantId,
        enableStatus: req?.body?.enable,
        fromTime: req?.body?.fromTime,
        toTime: req?.body?.toTime,
        externalItemIds: req?.body?.externalItemIds,
      });

      // Validate the incoming request body using the validation schema
      const { error } = this.validateItem.itemToggleStatus(req?.body);
      if (error) {
        // Log the validation failure and respond with an error
        const errorMessage = error.message;
        const responseError = orderConfirm(-1, {}, errorMessage);
        this.logger.error('ItemToggle validation failed', {
          error: errorMessage,
          responseError,
        });
        return res.status(400).json(responseError); // Respond with a 400 status code for validation errors
      }

      // Perform additional date validations if request body is present
      if (req?.body) {
        const currentDate = new Date();
        currentDate.setMinutes(currentDate.getMinutes() + 2);
        const fromDate = new Date(req?.body?.fromTime);
        const toDate = new Date(req?.body?.toTime);

        // Check if 'fromDate' is in the past
        if (fromDate && fromDate < currentDate) {
          const responseError = orderConfirm(-1, {}, ErrorMessage.ERROR.fromDate);
          this.logger.warn('FromDate is in the past', {
            fromDate,
            currentDate,
            responseError,
          });
          return res.status(400).json(responseError);
        }

        // Ensure 'fromDate' is not after 'toDate'
        if (fromDate && toDate && fromDate > toDate) {
          const responseError = orderConfirm(-1, {}, ErrorMessage.ERROR.toDate + 'fromTime');
          this.logger.warn('FromDate is after ToDate', {
            fromDate,
            toDate,
            responseError,
          });
          return res.status(400).json(responseError);
        }

        // Check if 'toDate' is in the past
        if (toDate && toDate < currentDate) {
          const responseError = orderConfirm(-1, {}, ErrorMessage.ERROR.toDate + 'currentTime');
          this.logger.warn('ToDate is in the past', {
            toDate,
            currentDate,
            responseError,
          });
          return res.status(400).json(responseError);
        }
      }

      // Validate that 'enable' is a boolean
      if (typeof req?.body.enable !== 'boolean') {
        const responseError = orderConfirm(-1, {}, ErrorMessage.ERROR.enable);
        this.logger.warn('Enable status is not a boolean', {
          enableStatus: req?.body.enable,
          responseError,
        });
        return res.status(400).json(responseError);
      }

      // Call the service layer to toggle item status

      const itemToggleResponse = await this.itemService.itemToggle(req);
      // Log and respond with success if the operation was successful
      if (itemToggleResponse?.statusCode !== 0) {
        this.logger.info('Item status toggled successfully', {
          itemToggleResponse,
        });
        return res.status(400).json(itemToggleResponse);
      }

      this.logger.info('Item status toggled successfully', {
        itemToggleResponse,
      });
      return res.status(200).json(itemToggleResponse);
    } catch (err) {
      // Catch and handle any unexpected errors, logging the error message and stack trace
      this.logger.error('Error in itemToggle function', {
        error: err.message,
        stack: err.stack,
      });
      res.status(500).send({ error: err.message });
    }
  }
}
module.exports = ItemController;
