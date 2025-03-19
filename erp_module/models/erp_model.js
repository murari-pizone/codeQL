const axios = require('axios'); // Import axios for making HTTP requests
const ERPRequest = require('../services/erp_service'); // Import ERPRequest class for generating request bodies and headers
const { sequelize } = require('../../config/db'); // Import sequelize instance for DB queries
const { apiERPEndPoint } = require('../../helpers/common_header'); // Import helper to get ERP API endpoint
const logger = require('../../utils/logger'); // Import logger for logging events and errors

class OrderModel {
  constructor(orderData) {
    this.orderData = orderData; // Store the order data passed to the constructor
    this.maxAttempts = 3; // Maximum number of retry attempts for sending the order to ERP
    this.retryDelay = 2000; // Delay between retry attempts in milliseconds
  }

  // Log the incoming order relay request and attempt to push the order to ERP
  async pushOrder(req, callback) {
    try {
      // Log the request data received in the order relay
      logger.info('--- Received orderRelay request ----', { req: req?.body });

      const orderId = this.orderData?.order_id; // Extract order ID from orderData
      const orderBody = { status: 'REQUESTED_TO_ERP' }; // Define the order status to be updated

      // Log the order ID and the status being updated
      logger.info(`Updating order status for order ID: ${orderId} to 'REQUESTED_TO_ERP'`);

      // Update the order status in the database
      if (!this.orderData?.order_edit) {
        await this.updateOrderStatus(orderId, orderBody);
      }

      // Initialize the ERPRequest class with the current order data
      const erpRequest = new ERPRequest(this.orderData);

      // Generate the body and headers for the ERP API request
      const apiBody = erpRequest.generateBody();
      const apiURL = `${process.env.ERP_URL}${apiERPEndPoint().pushOrder}`; // Get the API URL for pushing the order
      const headers = erpRequest.generateHeaders(); // Generate necessary headers for the request

      // Log the API URL where the order will be sent
      logger.info(`Pushing order to ERP system via URL: ${apiURL}`);

      // Make the API call with retries using the retryApiCall method
      return await this.retryApiCall(apiURL, apiBody, headers, this.orderData);
    } catch (error) {
      // If any error occurs, log it and call the callback with the error
      logger.error('Error pushing order:', error);
      callback(error);
    }
  }

  // Retry the API call a maximum number of times if the ERP system is unresponsive
  async retryApiCall(apiURL, ERP_body, ERP_Header, orderData) {
    let attempts = 0; // Initialize attempt counter
    let response; // Variable to store the response from ERP

    // Log the initial attempt to send the order
    logger.info(`Attempting to send order to ERP at ${apiURL}`);

    // Loop to retry the API call up to maxAttempts
    while (attempts < this.maxAttempts) {
      try {
        // Log the attempt number
        logger.info(`Attempt ${attempts + 1} of ${this.maxAttempts}`);

        // Make the POST request to the ERP system
        response = await axios.post(apiURL, ERP_body, { headers: ERP_Header });

        // Check the response status from ERP
        if (response.data[0]?.StatusResponse === 'KOTCONFIRMED') {
          // If the order is confirmed, log the transaction number and handle the confirmation
          logger.info(`Order confirmed from ERP with transaction number: ${response.data[0].TransactionNumber}`);
          await this.handleConfirmedOrder(orderData, response.data[0].TransactionNumber);
          break; // Exit the loop since the order was confirmed
        } else {
          // Log a warning if the response status is not 'KOTCONFIRMED'
          logger.warn(`Attempt ${attempts + 1} failed, StatusResponse: ${response.data[0]?.StatusResponse}`);
          attempts++; // Increment the attempt counter
          if (attempts === this.maxAttempts) {
            // Log an error if all attempts failed
            logger.error('Failed to confirm KOT after 3 attempts.');
          }
          await this.delay(this.retryDelay); // Wait before retrying
        }
      } catch (error) {
        // Log any errors during the API call and retry
        logger.error(`Error on attempt ${attempts + 1}:`, error.message);
        attempts++; // Increment the attempt counter
        if (attempts === this.maxAttempts) {
          // Log an error if all attempts failed
          logger.error('Max retry attempts reached. Exiting.');
        }
        await this.delay(this.retryDelay); // Wait before retrying
      }
    }

    // If the maximum number of attempts is reached and the order was not confirmed, log an error
    if (attempts === this.maxAttempts && response?.data[0]?.StatusResponse !== 'KOTCONFIRMED') {
      logger.error('Failed to push order after 3 attempts.');
    }
  }

  // Delay the next attempt by a specified number of milliseconds
  async delay(ms) {
    // Log the delay time before the next retry
    logger.info(`Delaying for ${ms}ms before retrying...`);
    return new Promise((resolve) => setTimeout(resolve, ms)); // Return a Promise that resolves after the delay
  }

  // Handle confirmed order status update once ERP returns a transaction number
  async handleConfirmedOrder(orderData, transactionNumber) {
    const orderBody = {
      erp_order_id: transactionNumber, // Attach the ERP transaction number to the order
      status: 'CONFIRMED_FROM_ERP', // Update the order status to 'CONFIRMED_FROM_ERP'
    };

    // If the order is not being edited, update its status in the database
    if (!orderData?.order_edit) {
      logger.info(`Updating order status to 'CONFIRMED_FROM_ERP' for order ID: ${orderData?.order_id}`);
      await this.updateOrderStatus(orderData?.order_id, orderBody);
    } else {
      // If the order is being edited, skip the status update
      logger.info('Order is being edited, skipping confirmation update.');
    }
  }

  // Update the order status in the database using a stored procedure
  async updateOrderStatus(orderId, orderBody) {
    // Log the order status update
    logger.info(`Updating order status for order ID: ${orderId}`);

    // Execute the database query to update the order status using Sequelize
    await sequelize.query(
      'EXEC [dbo].[mw_OrdersStatusUpdate] @orderId = :orderId, @inputJson = :erp_order_status', // SQL query to call the stored procedure
      {
        replacements: {
          orderId: orderId, // Replace the orderId placeholder
          erp_order_status: JSON.stringify(orderBody), // Convert the order status body to JSON
        },
        type: sequelize.QueryTypes.SELECT, // Specify query type as SELECT
      },
    );
  }
}

module.exports = OrderModel; // Export the OrderModel class for use in other files
