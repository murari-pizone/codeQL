// Import the necessary outlet service and constant for error handling
const outletService = require('../services/outlet_service'); // Service for handling outlet-related operations
const StoreToggleValidateOrder = require('../validators/validator');
const { orderConfirm } = require('../../common_module/common_response');
const storeToggleErrorMessage = require('../constant');

class OutletController {
  constructor(logger) {
    this.service = new outletService();
    this.logger = logger;
    this.StoreToggleValidateOrder = StoreToggleValidateOrder;
  }

  async createOutlet(req, res) {
    try {
      // Fetch outlets from the outletService
      const response = await this.service.createOutlet(req, 'createOutlets');

      // Check if the response was successful
      if (response?.success === 'OK') {
        // If the response is successful, return the data with HTTP status 200
        return res.status(200).json(response);
      } else {
        // If the response indicates failure, return a 500 Internal Server Error
        return res.status(500).json({
          status: 'internal server error', // Error message from constant
        });
      }
    } catch (err) {
      // If an error occurs during the process, return a 400 Bad Request error with the error message
      return res.status(500).send({ error: err.message });
    }
  }
  async removeOutlet(req, res) {
    try {
      // Fetch outlets from the outletService
      const response = await this.service.removeOutlet(req, 'removeOutlets');

      // Check if the response was successful
      if (response?.success === 'OK') {
        // If the response is successful, return the data with HTTP status 200
        return res.status(200).json(response);
      } else {
        // If the response indicates failure, return a 500 Internal Server Error
        return res.status(500).json({
          status: 'internal server error', // Error message from constant
        });
      }
    } catch (err) {
      // If an error occurs during the process, return a 400 Bad Request error with the error message
      return res.status(500).send({ error: err.message });
    }
  }

  async getAllOutlets(req, res) {
    try {
      // Fetch outlets from the outletService
      const response = await this.service.getOutlets(req, 'Outlets');

      // Check if the response was successful
      if (response?.success === 'OK') {
        // If the response is successful, return the data with HTTP status 200
        return res.status(200).json(response);
      } else {
        // If the response indicates failure, return a 500 Internal Server Error
        return res.status(500).json({
          status: 'internal server error', // Error message from constant
        });
      }
    } catch (err) {
      // If an error occurs during the process, return a 400 Bad Request error with the error message
      return res.status(500).send({ error: err.message });
    }
  }
  async GetAllBranchRegion(req, res) {
    try {
      // Fetch outlets from the outletService
      const response = await this.service.GetBranchRegion(req, 'Region');

      // Check if the response was successful
      if (response?.success === 'OK') {
        // If the response is successful, return the data with HTTP status 200
        return res.status(200).json(response);
      } else {
        // If the response indicates failure, return a 500 Internal Server Error
        return res.status(500).json({
          status: 'internal server error', // Error message from constant
        });
      }
    } catch (err) {
      // If an error occurs during the process, return a 400 Bad Request error with the error message
      return res.status(500).send({ error: err.message });
    }
  }

  async storeToggle(req, res) {
    try {
      // Log the incoming request for debugging and tracking purposes.
      this.logger.info('--- Received StoreToggle request ----', {
        req: req?.body,
      });
      // Extract external_order_id and swiggy_order_id from the request body.
      // const id = Number(req?.body.partnerid);

      const { error } = this.StoreToggleValidateOrder.storeToggleStatus(req?.body);
      if (error) {
        const originalString = error.message;

        // Construct an error response object with detailed information.
        const responseError = orderConfirm(-1, {}, originalString);

        // Log the error for debugging and monitoring.
        this.logger.error('StoreToggle validation failed', { responseError });

        // Respond with a 422 status code and the error response.
        return res.status(400).json(responseError);
        // return res.json(responseError);
      }

      if (typeof req?.body.isRequestedToOpen !== 'boolean') {
        // Accepts boolean values only
        const responseError = orderConfirm(-1, {}, storeToggleErrorMessage.ERROR.isRequestedToOpenDatatype);

        return res.status(400).json(responseError);
        // return res.json(responseError)
      }

      const currentDate = new Date();
      const fromDate = new Date(req?.body?.fromTime);
      const toDate = new Date(req?.body?.toTime);
      if (fromDate && fromDate < currentDate) {
        const responseError = orderConfirm(-1, {}, storeToggleErrorMessage.ERROR.fromDate + ' currentTime');
        return res.status(400).json(responseError);
      }
      if (fromDate && toDate && fromDate > toDate) {
        const responseError = orderConfirm(-1, {}, storeToggleErrorMessage.ERROR.toDate + 'formTime');
        return res.status(400).json(responseError);
      }
      if (toDate && toDate < currentDate) {
        const responseError = orderConfirm(-1, {}, storeToggleErrorMessage.ERROR.toDate + ' currentTime');
        return res.status(400).json(responseError);
      }

      const storeToggleResponse = await this.service.storeToggle(req);

      if (storeToggleResponse?.statusCode === 0) {
        res.status(200).json(storeToggleResponse);
      } else {
        res.status(404).json(storeToggleResponse);
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  }
}
module.exports = OutletController;
