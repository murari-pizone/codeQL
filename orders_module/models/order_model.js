const { headerBody, apiERPEndPoint } = require('../../helpers/common_header');
// const json = require('../services/json_service');
// const constant = require('../constant');
const logger = require('../../utils/logger');
const { sequelize } = require('../../config/db');
const erp_module = require('../../erp_module/controllers/erp_controller');
const axios = require('axios');
class OrderService {
  constructor() {
    this.logger = logger;
  }

  async orderConfirm(req, callback) {
    try {
      this.logger.info('--- Entered orderConfirm Request (model) ----', {
        req: req,
      });
      const SWIGGY_URL = process.env.SWIGGY_URL + apiERPEndPoint().order_confirm;
      const swiggy_Header = headerBody();
      //  const swiggy_body = json.swiggyJSON(res, constant.KEY.CONFIRM);
      const swiggy_body = req.body;
      const response = await axios.post(SWIGGY_URL, swiggy_body, {
        headers: swiggy_Header,
      });
      const { swiggy_order_id, external_order_id } = req.body;

      const orderData = {
        status: 'CONFIRMED_FROM_ERP',
        order_id: swiggy_order_id,
        external_order_id: external_order_id,
      };
      const replacements = {
        orderData: JSON.stringify(orderData), // Convert the order data object to JSON string
        order_cancel: 1,
      };
      // SP execution (srp)
      if (response?.data.statusCode === 0) {
        const order = await this.executeSP(
          'EXEC [dbo].[mw_SaveOrUpdateOnlineOrder] @orderData = :orderData,@order_cancel=:order_cancel',
          replacements,
        );
        const status_message = order[0].status;
        const status_code = order[0].statusCode;
        callback(null, {
          statusCode: status_code,
          statusMessage: status_message,
        });
      } else {
        logger.info({ orderConfirmResponse: response });
        this.logger.info('--- Order Confirm api call done to swiggy (model) ----', {
          req: response || 'post api is commented',
        });
        callback(null, response.data);
      }
    } catch (error) {
      this.logger.error('Error Occured in order comfirm (model)', { error });
      callback(error);
    }
  }

  async orderMFR(req, callback) {
    try {
      this.logger.info('--- Entered Request OrderMFR (model) ----', {
        req: req?.body,
      });
      const SWIGGY_URL = process.env.SWIGGY_URL + apiERPEndPoint().order_mfr;
      const swiggy_Header = headerBody();
      //  const swiggy_body = json.swiggyJSON(res, constant.KEY.CONFIRM);
      const swiggy_body = req.body;
      const response = await axios.post(SWIGGY_URL, swiggy_body, {
        headers: swiggy_Header,
      });

      // fetching status code
      const { swiggy_order_id, external_order_id } = req.body;

      const orderData = {
        status: 'MFR',
        order_id: swiggy_order_id,
        external_order_id: external_order_id,
      };
      const replacements = {
        orderData: JSON.stringify(orderData), // Convert the order data object to JSON string
        order_cancel: 1,
      };
      // SP execution (srp)
      if (response.data.statusCode === 0) {
        const order = await this.executeSP(
          'EXEC [dbo].[mw_SaveOrUpdateOnlineOrder] @orderData = :orderData,@order_cancel=:order_cancel',
          replacements,
        );

        const status_message = order[0].status;
        const status_code = order[0].statusCode;
        this.logger.info('--- OrderMFR (model) Successfull ----', {
          res: 'api call is commented above',
        });
        callback(null, {
          statusCode: status_code,
          statusMessage: status_message,
        });
      } else {
        callback(null, response.data);
      }

      // const result =   await axios.post(swiggyURL+`${rId}`+'/full-menu',res,{headers: swiggyHeader})
    } catch (error) {
      this.logger.error('Error Occured in OderMFR (model)', { error });
      callback(error);
    }
  }

  async getOrders(req, callback) {
    try {
      this.logger.info('--- Entered Request For Get Orders (model) ----', {
        req: req?.query,
      });
      let { limit } = req.query;
      const { page, order_id, startDate, endDate, sortColumn, sortDirection, status, search } = req.query;
      if (limit === 'All') {
        limit = 999999999;
      }
      const replacements = {
        PageNumber: page || 1,
        PageSize: limit || 12,
        OrderID: order_id || null,
        StartDate: startDate || null,
        EndDate: endDate || null,
        SortColumn: sortColumn || 'Aggregator_Order_Id',
        SortDirection: sortDirection || 'ASC',
        Status: status || null,
        Search: search || null,
      };
      // SP execution (srp)
      const order = await this.executeSP(
        'EXEC mw_GetAllOrdersDetails @PageNumber = :PageNumber, @PageSize = :PageSize, @OrderID =:OrderID,@StartDate =:StartDate,@EndDate =:EndDate,@SortColumn =:SortColumn,@SortDirection =:SortDirection,@Status=:Status,@Search=:Search',
        replacements,
      );

      callback(null, {
        statusCode: 200,
        data: JSON.parse(order[0].data),
        totalDelivered: order[0].DeliveredCount,
        totalRecordCount: order[0].TotalRecordCount,
        totalCancelled: order[0].CancelledCount,
        totalPending: order[0].PendingCount,
        totalCount: order[0].TotalCount,
        PageNumber: order[0].PageNumber,
        pageSize: order[0].PageSize,
        message: '',
        success: 'Ok',
      });
      //  const result = await axios.post(swiggyURL+`${rId}`+'/full-menu',res,{headers: swiggyHeader})
      this.logger.info('--- Get Order (model) Successfull ----', {
        req: 'api call is commented above',
      });
    } catch (error) {
      this.logger.error('Error Occured in Get Orders (model)', { error });
      callback(error);
    }
  }

  async orderCancel(req, callback) {
    try {
      this.logger.info('--- Entered Request For Order Cancel (model) ----', {
        req: req?.body,
      });
      const { swiggy_order_id, external_order_id, cancellation_reason } = req.body;

      const orderData = {
        status: 'CANCELLED',
        cancellation_reason: cancellation_reason,
        order_id: swiggy_order_id,
        external_order_id: external_order_id,
      };

      const replacements = {
        orderData: JSON.stringify(orderData), // Convert the order data object to JSON string
        order_cancel: 1,
      };
      // SP execution (srp)
      const order = await this.executeSP(
        'EXEC [dbo].[mw_SaveOrUpdateOnlineOrder] @orderData = :orderData,@order_cancel=:order_cancel',
        replacements,
      );

      callback(
        null, // No error
        {
          statusMessage: order[0]?.status, // Success message
          statusCode: order[0]?.statusCode, // Status code 0 indicates success
          data: {
            external_order_id: order[0]?.id, // The ID of the newly created order in the database
            swiggy_order_id: order[0]?.order_id,
          }, // No additional data needed
        },
      );
      this.logger.info('--- Request Order Cancel successfull (model) ----', {
        statusMessage: order[0]?.status, // Success message
        statusCode: order[0]?.statusCode, // Status code 0 indicates success
        data: {
          external_order_id: order[0]?.id, // The ID of the newly created order in the database
          swiggy_order_id: order[0]?.order_id,
        }, // No additional data needed
      });
    } catch (error) {
      // Catch any errors during the process and pass them to the callback
      this.logger.error('Error Occured in Order Cancel (model)', { error });
      callback(error); // Send the error to the callback
    }
  }

  async orderCreate(req, callback) {
    try {
      this.logger.info('--- Enterted request Order create (model) ----', {
        req: req?.body,
      });
      // Extract the order data from the request body
      const orderData = req?.body;
      orderData['status'] = 'ORDER_RECEIVED';
      const replacements = {
        orderData: JSON.stringify(orderData), // Pass the order data as a JSON string
        order_cancel: 0,
      };

      // SP execution (srp)
      const order = await this.executeSP(
        'EXEC [dbo].[mw_SaveOrUpdateOnlineOrder] @orderData = :orderData,@order_cancel=:order_cancel',
        replacements,
      );
      orderData['external_order_id'] = order[0]?.external_order_id;
      erp_module.pushOrder(orderData);
      callback(null, {
        timestamp: new Date(), // Current timestamp indicating when the request was processed
        status_code: order[0]?.statusCode, // HTTP status code 202 (Accepted) indicates the order was successfully received
        status_message: order[0]?.status, // Success message
        external_order_id: order[0]?.external_order_id, // The ID of the newly created order in the database
        swiggy_order_id: order[0]?.order_id, // The original Swiggy order ID
      });

      this.logger.info('---Request for Order Create Successfull (model)----', {
        timestamp: new Date(), // Current timestamp indicating when the request was processed
        status_code: order[0]?.statusCode, // HTTP status code 202 (Accepted) indicates the order was successfully received
        status_message: order[0]?.status, // Success message
        external_order_id: order[0]?.external_order_id, // The ID of the newly created order in the database
        swiggy_order_id: order[0]?.order_id, // The original Swiggy order ID
      });
    } catch (error) {
      this.logger.error('Error Occured in Order Create (model)', { error });
      // If any error occurs during the process, the catch block will handle it and pass the error to the callback
      callback(error);
    }
  }

  async deliveryStatus(req, callback) {
    try {
      this.logger.info('--- Entered Request For Delivery status (model)----', {
        req: req?.body,
      });
      const { order_id, status } = req.body;

      const replacements = {
        orderId: order_id, // Convert the order data object to JSON string
        status: status,
      };
      // SP execution (srp)
      const order = await this.executeSP(
        'EXEC [dbo].[mw_OrdersStatusUpdate] @orderId = :orderId,@status=:status',
        replacements,
      );

      callback(null, {
        status_code: order[0]?.statusCode,
        status_message: order[0]?.status,
        timestamp: new Date(),
        swiggy_order_id: order[0]?.order_id,
      });

      this.logger.info('--- Request For Delivery Status Successfull (model) ----', {
        status_code: order[0]?.statusCode,
        status_message: order[0]?.status,
        timestamp: new Date(),
        swiggy_order_id: order[0]?.order_id,
      });
    } catch (error) {
      // Catch any errors during the process and pass them to the callback
      this.logger.error('Error Occured in Delivery Status (model)', { error });
      callback(error);
    }
  }

  async orderTime(req, callback) {
    try {
      this.logger.info('--- Entered Request For Order Time (model) ----', {
        req: req?.body,
      });
      const { orderId } = req.body;
      // const SWIGGY_URL = `${process.env.SWIGGY_URL}${apiERPEndPoint().s_itemToggle}?order_id=${orderId}`;
      // const header_body = headerBody(constant.KEY.SHK);
      // const content_body = req?.body;
      // const response =   await axios.get(SWIGGY_URL,content_body,{headers: header_body})
      const obj = {
        statusCode: 0,
        data: {
          orderId: orderId,
          timeToArrive: 1655982444296,
        },
        statusMessage: 'Request successfully processed',
      };
      callback(null, obj);
      this.logger.info('--- Request For Order Time Successfull (model) ----', {
        res: obj,
      });
    } catch (err) {
      this.logger.error('Error Occured in Order Time (model)', { err });
      throw new Error(err);
    }
  }

  async executeSP(query, replacements) {
    try {
      this.logger.info('--- Executing Store Procedure for the above function (model) ----', {
        query: query,
        replacements: replacements,
      });
      const result = await sequelize.query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT,
      });
      this.logger.info('--- Done with SP - Success (model) ----', {
        req: result,
      });
      return result;
    } catch (error) {
      this.logger.error('Error in S.P Executing (model)', { err: error });
      throw new Error('Database query for execution Store Procedure failed: ' + error.message);
    }
  }
}

module.exports = OrderService;
