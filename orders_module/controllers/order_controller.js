const { orderRelayResponse, orderConfirm, orderErrorResponse } = require('../../common_module/common_response');
const OrderService = require('../services/order_service');
const axios = require('axios');

class OrderController {
  constructor(logger, validateOrder) {
    this.service = new OrderService();
    this.logger = logger;
    this.validateOrder = validateOrder;
  }

  // Handle the relay or update of an order.
  async orderRelay(req, res) {
    try {
      this.logger.info('--- Received orderRelay request ----', {
        req: req?.body,
      });

      const { error } = this.validateOrder.orderRelayStatus(req?.body);

      if (error) {
        const [message, code] = error.message.trim().split(/ (?!.* )/);
        const errorResponse = orderRelayResponse(new Date(), code, message, null, req?.body?.order_id, message);
        this.logger.error(message, { errorResponse });
        return res.status(400).json(errorResponse);
      }

      this.logger.info('Processing new order relay', {
        order_id: req?.body?.order_id,
      });
      const response = await this.service.orderCreate(req);
      this.logger.info('Processed new order relay', { response });
      return res.status(200).json(response);
    } catch (err) {
      this.logger.error('An unexpected error occurred in OrderRelay Request', {
        error: err.message,
        order_id: req?.body?.order_id,
      });
      return res.status(500).json({ error: err.message });
    }
  }
  async orderRelay1(req, res) {
    try {
      this.logger.info('--- Received orderRelay request ----', {
        req: req?.body,
      });

      const { error } = this.validateOrder.orderRelayStatus(req?.body);

      if (error) {
        const [message, code] = error.message.trim().split(/ (?!.* )/);
        const errorResponse = orderRelayResponse(new Date(), code, message, null, req?.body?.order_id, message);
        this.logger.error(message, { errorResponse });
        return res.status(400).json(errorResponse);
      }

      this.logger.info('Processing new order relay', {
        order_id: req?.body?.order_id,
      });
      const response = await axios.post('http://localhost:4000/api/v1/order/relay', req?.body, {
        headers: {
          'api-key':
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiY2xpZW50Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMwODczNDQ0fQ.80pOxx8_e6d7K9GH47t2JOq9GEuGaz3Rzt6nJUdi-j8',
        },
      });
      this.logger.info('Processed new order relay', response?.data);
      return res.status(200).json(response?.data);
    } catch (err) {
      this.logger.error('An unexpected error occurred in OrderRelay Request', {
        error: err.message,
        order_id: req?.body?.order_id,
      });
      return res.status(500).json({ error: err.message });
    }
  }

  // Handle order confirmation (under work)
  async orderConfirm(req, res) {
    this.logger.info('--- Received OrderConfirm request ----', {
      req: req?.body,
    });

    try {
      const order_Response = await this.service.orderConfirm(req);
      this.logger.info('--- Order Confirmed Successfull ----', {
        req: order_Response,
      });
      return res.status(200).json(order_Response);
    } catch (err) {
      this.logger.error('Error Occured in order confirm Request', {
        err: err.message,
      });
      return res.status(400).json({ error: err.message });
    }
  }

  // Handle MFR (Manufacturer Return) requests
  async orderMFR(req, res) {
    try {
      this.logger.info('--- Received MFR request ----', { req: req?.body });

      const { error } = this.validateOrder.orderMFRStatus(req?.body);
      if (error) {
        const responseError = orderConfirm(-1, {}, error.message);
        this.logger.error('Order MFR Validation Failed', {
          error: responseError,
        });
        return res.status(400).json(responseError);
      }

      const MFR_Response = await this.service.orderMFR(req);
      this.logger.info('--- OrderMFR Successfull ----', { req: MFR_Response });

      return res.status(200).json(MFR_Response);
    } catch (err) {
      this.logger.error('Error in OrderMFR Request', { err: err.message });
      return res.status(500).json({ error: err.message });
    }
  }

  // Handle get orders detail
  async getOrders(req, res) {
    try {
      this.logger.info('--- Received Get Order Request  ----', { req: req });

      const order_Response = await this.service?.getOrders(req);
      this.logger.info('--- Received Get Order Request successfull ----', {
        req: order_Response,
      });

      res.status(200).json(order_Response);
    } catch (err) {
      this.logger.error('Error in Get Order Request', { err: err.message });
      res.status(400).json({ error: err.message });
    }
  }

  // Handle push the order (hold)
  async pushOrder(req, res) {
    try {
      this.logger.info('--- Received Request Push Order ----', { req: req });
      const order_Response = await this.service.pushOrder(req);
      this.logger.info('---  Request for Push Order Successfull ----', {
        req: order_Response,
      });
      res.status(200).json(order_Response);
    } catch (err) {
      this.logger.error('Error Occured in Push Order Request', {
        err: err.message,
      });
      res.status(400).json({ error: err.message });
    }
  }

  // Controller function to handle the cancellation of an order.
  async orderCancel(req, res) {
    try {
      this.logger.info('--- Received Request Order Cancel ----', {
        req: req?.body,
      });

      // Validate the request body for order cancellation details using a validation function.
      const { error } = this.validateOrder.orderCancelStatus(req?.body);

      // If there's a validation error, log it and return a 422 Unprocessable Entity response with the error details.
      if (error) {
        const originalString = error.message;

        // Construct an error response object with detailed information.
        const responseError = orderErrorResponse(
          -1,
          originalString,
          new Date(),
          req.body.external_order_id,
          order_id,
          originalString,
        );

        // Log the error for debugging and monitoring.
        this.logger.error('Order Cancel validation failed', {
          order_id,
          responseError,
        });

        // Respond with a 422 status code and the error response.
        return res.status(400).json(responseError);

        // return res.json(responseError);
      }
      // If the external_order_id is not a valid number, return a 404 error.
      else {
        // If no order is found with the provided external_order_id, return a 404 error.

        // If no order is found with the provided swiggy_order_id, return a 404 error.

        // Log the start of the order cancellation process.
        // logger.error('Processing order cancelled', { order_id: order_id });

        // Call the orderCancel service to process the cancellation.
        const order_Response = await this.service.orderCancel(req);

        this.logger.info('--- Received Request For Order Cancel Successfull ----', { req: order_Response });
        // Log the successful processing of the order cancellation.
        // logger.error('Processed order cancelled', { order_id: order_id });

        // Respond with a 200 status code and the cancellation response.
        return res.status(200).json(order_Response);
      }
    } catch (err) {
      // If an unexpected error occurs, log the error and return a 500 Internal Server Error response.
      this.logger.error('An error occurred while order cancelled', {
        error: err.message,
        order_id: '',
      });

      // Respond with a 500 status code and the error message.
      res.status(500).json({ error: err.message });
    }
  }

  // Controller function to handle the delivery status update for an order.
  async deliveryStatus(req, res) {
    try {
      this.logger.info('--- Received Request Delivery Status ----', {
        req: req?.body,
      });
      const order_id = req?.body.order_id;
      // Validate the request body for required data using a validation function.
      const { error } = this.validateOrder.orderDeliveryStatus(req?.body);
      // If there's a validation error, log it and return a 422 Unprocessable Entity response with the error details.
      if (error) {
        // Construct a detailed error response object.
        const originalString = error.message;
        const response = orderErrorResponse(-1, originalString, new Date(), null, order_id, originalString);
        this.logger.error('Validation Error in Delivery Status');
        // Log the error for monitoring and troubleshooting purposes.
        this.logger.error(originalString, response);

        // Respond with a 422 status code and the error response.
        return res.status(400).json(response);
      } else {
        // If the input is valid, proceed to find the order in the database.

        // If the order exists, log that the order status processing is starting.
        this.logger.info('Delivery Status : Processing new order status Initiated', { order_id });
        // Call the deliveryStatus service to update the order status.
        const order_Response = await this.service.deliveryStatus(req);
        // Log that the order status has been successfully processed.
        this.logger.info('Delivery Status : Processed new order status Successfull', { order_Response });
        // Respond with a 200 status code and the result from the service.
        return res.status(200).json(order_Response);
      }
    } catch (err) {
      // If an unexpected error occurs, log the error and return a 500 Internal Server Error response.
      this.logger.error('An error occurred while updating delivery status', {
        error: err.message,
        order_id: req?.body?.order_id,
      });

      // Respond with a 500 status code and the error message.
      res.status(500).json({ error: err.message });
    }
  }

  // Controller function to handle the delivery timing.
  async deliveryTime(req, res) {
    try {
      this.logger.info('--- Received Request delivery time ----', {
        req: req?.body,
      });
      // Extract the order_id from the request body.
      const order_id = req?.body.orderId;

      // Validate the request body for required data using a validation function.
      const { error } = this.validateOrder.orderTimeStatus(req?.body);

      // If there's a validation error, log it and return a 422 Unprocessable Entity response with the error details.
      if (error) {
        this.logger.error('Error in validation in Delivery Time', { error });

        // Construct a detailed error response object.
        const originalString = error.message;
        const response = orderConfirm(-1, {}, originalString);

        // Log the error for monitoring and troubleshooting purposes.
        this.logger.error(originalString, response);

        // Respond with a 422 status code and the error response.
        return res.status(400).json(response);
      } else {
        // If the input is valid, proceed to find the order in the database.
        // const order = await Orders.findOne({ where: { order_id } });
        const order = false;
        // If no order is found with the provided order_id, return a 404 Not Found response.
        if (!order) {
          const response = orderConfirm(-1, {});

          // Log the "Order not found" error.
          this.logger.error('Order not found in delivery Timing', response);

          // Respond with a 404 status code and the error response.
          return res.status(404).json();
          // return res.json(response);
        } else {
          // If the order exists, log that the order status processing is starting.
          this.logger.info('Processing order time status', { order_id });

          // Call the deliveryStatus service to update the order status.
          const order_Response = await this.service.orderTime(req);

          // Log that the order status has been successfully processed.
          this.logger.info('Processed order time status Successfull', {
            order_Response,
          });

          // Respond with a 200 status code and the result from the service.
          return res.status(200).json(order_Response);
        }
      }
    } catch (err) {
      // If an unexpected error occurs, log the error and return a 500 Internal Server Error response.
      this.logger.error('An error occurred while updating delivery status', {
        error: err.message,
        order_id: req?.body?.order_id,
      });

      // Respond with a 500 status code and the error message.
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = OrderController;
