const menuService = require('../services/menu_service');

class MenuController {
  constructor(logger) {
    this.service = menuService;
    this.logger = logger;
  }

  async getMenuByOutlet(req, res) {
    try {
      // Log incoming request
      this.logger.info('Received request to get menu by outlet', {
        outlet: req.body,
      });

      // Call the service to sync the menu for the outlet
      const response = await this.service.getMenu(req);

      // Log the response before sending
      this.logger.info('Menu fetched successfully', { response });

      // Send the successful response with the synced menu data
      res.status(200).send(response);
    } catch (err) {
      // Log the error
      this.logger.error('Error fetching menu', { error: err.message });

      // Handle any errors by sending a 400 status with the error message
      res.status(400).send({ error: err.message });
    }
  }

  // not using as per the new update

  // not using as per the new update as of now ...

  async menuSyncLogic(req, res) {
    try {
      // Step 1: Normalize Input
      const requestData = this.normalizeInput(req.body);

      // Step 2: Log Input
      this.logger.info('Sync Menu Items - Request Received', { requestData });

      // Step 3: Process Each Item
      const responses = await this.processItems(requestData);

      // Step 4: Determine and Send Final Response
      const finalResponse = Array.isArray(req.body) ? responses : responses[0];

      // Log the final response
      this.logger.info('Sync Menu Items - Final Response', { finalResponse });

      res.status(responses[0].statusCode).json(finalResponse);
    } catch (err) {
      // Log the error
      this.logger.error('Error during menu sync logic', { error: err.message });

      res.status(400).send({ error: err.message });
    }
  }

  // not using as per the new update as of now ...

  // not using as per the new update as of now ...
  async syncMenuError(req, res) {
    try {
      this.logger.info('Received request for syncing menu error');

      const response = await this.service.syncMenuError(req);

      // Log response
      this.logger.info('Sync menu error response', { response });

      res.status(200).json(response);
    } catch (err) {
      this.logger.error('Error during sync menu error', { error: err.message });

      res.status(400).send({ error: err.message });
    }
  }
  async syncMenuTrack(req, res) {
    try {
      this.logger.info('Received request for Track Sync Menu');

      const response = await this.service.syncMenuTrack(req);

      // Log response
      this.logger.info('Sync menu Track  response', { response });

      res.status(200).json(response);
    } catch (err) {
      this.logger.error('Error during sync menu tracking', {
        error: err.message,
      });

      res.status(400).send({ error: err.message });
    }
  }

  normalizeInput(body) {
    return Array.isArray(body) ? body : [body];
  }

  async processItems(items) {
    return Promise.all(
      items.map(async (item) => {
        this.logger.info('Processing Sync Menu Item', { item });
        const result = await this.service.syncMenuItems(item);
        this.logger.info('Sync Menu Item - Response Received', {
          item,
          result,
        });
        return result;
      }),
    );
  }

  async createItem(req, res) {
    try {
      // Fetch outlets from the outletService
      const response = await this.service.createItem(req, 'createItem');

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
  async removeItem(req, res) {
    try {
      // Fetch outlets from the outletService
      const response = await this.service.removeItem(req, 'removeItem');

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
}

module.exports = MenuController;
