// Import required dependencies and modules
const { sequelize } = require('../../config/db');
const { headerBody } = require('../../helpers/common_header'); // Helper functions to create headers and API endpoints
const axios = require('axios'); // Library for making HTTP requests
const createResponse = require('../../common_module/common_response'); // Module for creating standard responses
const logger = require('../../utils/logger'); // Logger utility for logging errors or important messages

class MenuModel {
  constructor(service) {
    this.service = service;
  }

  // Sync menu error logs with pagination
  async syncMenuError(req, callback) {
    try {
      const { page, limit } = req.query;
      const replacements = {
        PageNumber: page ? page : 1,
        PageSize: limit ? limit : 12,
      };
      // SP execution (srp)

      logger.info(`Fetching sync menu error logs: page ${page}, limit ${limit}`);
      const res = await this.executeSpForModel(
        ' EXEC [dbo].[mw_GetMenuSynchDetails]  @PageNumber = :PageNumber, @PageSize = :PageSize',
        replacements,
      );
      const extractedData = res[0];
      logger.info(`Found ${res} records in syncMenuError`);
      return callback(null, {
        success: 'OK',
        data: JSON.parse(extractedData.Data),
        totalCount: extractedData.TotalRecords,
        currentPage: page,
        pageSize: limit,
        message: '',
        statusCode: 200,
      });
    } catch (error) {
      logger.error('Error in syncMenuError method: ', error);
      callback(error);
    }
  }

  async syncMenuTrack(req, callback) {
    try {
      const { ShopCode } = req.body;
      logger.info(`Tracking request for shopCode : ${ShopCode}`);
      const res = await this.executeSpForModel(` EXEC [dbo].[mw_GetMenuSynchDetails] @ShopCode = ${ShopCode}`);
      const extractedData = res[0];
      extractedData.Data = JSON.parse(extractedData.Data);
      logger.info(`Syncing menu for ShopCode: ${ShopCode} to Swiggy...`);
      const swiggy_Header = headerBody('SWIGGY');
      const swiggyURL =
        'https://externalha-dominos.in-west.swig.gy/v1/request-tracker/' + extractedData.Data[0].Request_Id;
      logger.info('Sending data to Swiggy API...');
      const result = await axios.get(swiggyURL, { headers: swiggy_Header });

      if (result) {
        const lastElement = result.data.data;
        const keyPrefix = 'MENU|';
        const matchingKey = Object.keys(lastElement).find((key) => key.startsWith(keyPrefix));
        // Get the value of the matched keyconst value = matchingKey ? obj[matchingKey] : undefined;

        extractedData.Data[0].Sync_Status = lastElement[matchingKey][0].status;

        // // Construct the JSON object
        // const input_json = {
        //     "Shop_Code": parseInt(ShopCode),
        //     "Request_Id": extractedData.Data[0].Request_Id,
        //     "Sync_Status": lastElement[matchingKey][0].status
        // };

        // Define the replacements object
        const replacements = {
          Input_Json: JSON.stringify(extractedData.Data[0]), // Ensure the JSON is stringified
          Sync_Status_Update: 1, // 1 for true (BIT type in SQL Server)
        };

        // Use parameterized query with `replacements` object to safely pass parameters
        await this.executeSpForModel(
          `
                    EXEC [dbo].[mw_MenuSynchDetails]
                        @Input_Json = :Input_Json,   -- Parameterized query
                        @Sync_Status_Update = :Sync_Status_Update  -- Parameterized query
                `,
          replacements,
        );
      }

      return callback(null, {
        success: result.data.code,
        last_synced: extractedData?.Data[0]?.Edited_Timestamp,
        data: result.data.data,
        message: '',
        statusCode: result.data.statusCode,
      });
    } catch (error) {
      logger.error('Error in syncMenuError method: ', error);
      callback(error);
    }
  }

  // Get menu data from the database and return as response
  async getMenu(res, callback) {
    try {
      let { limit } = res.query;
      const { page, sortColumn, sortDirection, search } = res.query;
      const { ShopCode } = res.body;

      if (limit === 'All') {
        limit = 9999999999999;
      }
      logger.info(`Fetching menu for ShopCode: ${ShopCode}, page: ${page}, limit: ${limit}`);
      const replacements = {
        outlet: ShopCode || null,
        Page: page || 1,
        Limit: limit || 12,
        SortDirection: sortDirection || 'ASC',
        SortColumn: sortColumn || 'Iname',
        Search: search || null,
      };
      const result = await this.executeSpForModel(
        'EXEC [dbo].[mw_GetAllMenuItemsByOutletId] @outlet = :outlet,@PageNumber=:Page,@PageSize=:Limit,@SortColumn=:SortColumn,@SortDirection=:SortDirection,@Search=:Search',
        replacements,
      );
      logger.info(`Fetched menu data for ShopCode: ${ShopCode}`);
      callback(null, {
        statusCode: 200,
        data: JSON.parse(result[0]?.data),
        pageNumber: result[0].pageNumber,
        pageSize: result[0].PageSize,
        totalPages: result[0].TotalPages,
        totalCount: result[0].TotalCount,
        message: '',
        success: 'Ok',
      });
    } catch (error) {
      logger.error('Error in getMenu method: ', error);
      callback(error);
    }
  }

  async createMenuOnSwiggy(req, shopCode, callback) {
    try {
      logger.info(`Syncing menu for ShopCode: ${shopCode} to Swiggy...`);
      const swiggy_Header = headerBody('SWIGGY');
      const swiggyURL = 'https://externalha-dominos.in-west.swig.gy/v1/restaurant/42401/full-menu';

      logger.info('Sending data to Swiggy API...');
      const result = await axios.post(swiggyURL, req, {
        headers: swiggy_Header,
      });
      const response = result?.data;
      logger.info('Received response from Swiggy API: ', response);

      if (result) {
        // Construct the JSON object
        const input_json = {
          Shop_Code: parseInt(shopCode), // Remove unnecessary interpolation for number
          Status_Code: response.statusCode === 202 ? 1 : 0, // No need for string interpolation for numbers
          Data: response.data ? response.data : null, // If data exists, use it; otherwise, use null
          Status_Message: response.statusMessage, // No interpolation needed if it's a string
          Code: response.code, // Directly assign value if it's a string or number
          Request_Id: response.request_id, // Same as above
          Error: response.errors ? JSON.stringify(response.errors) : null, // Stringify errors if present, otherwise null
          IsMenuSynched: parseInt('0'), // Parsing as integer, '0' results in 0
          Sync_Json: JSON.stringify(req), // Stringify the request object
          Sync_Status: 'In progress', // Static string value
        };

        // Convert the object into a JSON string
        const replacements = {
          Input_Json: JSON.stringify(input_json),
          Sync_Status_Update: 0,
        };
        // Call the stored procedure with the JSON string as a parameter
        await this.executeSpForModel(
          `
                    EXEC [dbo].[mw_MenuSynchDetails] 
                        @Input_Json = :Input_Json ,
                        @Sync_Status_Update = :Sync_Status_Update
                `,
          replacements,
        );
      }

      return callback(
        null,
        createResponse.createResponseMenu(
          req,
          response.code,
          response.request_id,
          response.Error === null ? [] : response.Error,
          response.statusMessage,
          response.statusCode,
        ),
      );
    } catch (error) {
      logger.error('Error in createMenuOnSwiggy method: ', error);
      callback(error);
    }
  }

  async executeSpForModel(query, replacements) {
    try {
      logger.info('--- Executing Store Procedure for the above function (model) ----', {
        query: query,
        replacements: replacements,
      });
      const result = await sequelize.query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT,
      });
      logger.info('--- Done with SP - Success ---- (model)', { req: result });
      return result;
    } catch (error) {
      logger.error('Error in S.P Executing (model)', { err: error });
      throw new Error('Database query for execution Store Procedure failed: (model) ' + error);
    }
  }

  async createItem(req, key, callback) {
    try {
      // Destructure the relevant fields from the request body
      const data = req?.body;

      // Prepare the JSON object to pass to the stored procedure
      const inputJson = data;

      // Prepare the replacements object for the stored procedure execution
      const replacements = {
        InputJson: JSON.stringify(inputJson), // Pass the JSON string as a parameter
        Delete: 0,
        Icode: null, // Set Delete flag to 0 for Create/Update (0 = false)
      };

      // Call the stored procedure for Create/Update
      const result = await this.executeSpForModel(
        '[dbo].[UpsertDoorDeliveryItem] @InputJson= :InputJson,@Delete= :Delete, @Icode= :Icode',
        replacements,
      );

      // Return the result through the callback
      callback(null, {
        success: 'OK',
        data: [],
        message: result[0]?.response_message,
        statusCode: 200,
      });
    } catch (error) {
      // Handle any errors and pass them to the callback
      callback(error);
    }
  }

  async removeItem(req, key, callback) {
    try {
      // Destructure the relevant fields from the request body
      const data = req?.body;

      // Prepare the JSON object to pass to the stored procedure
      const Icode = data.Icode;

      // Prepare the replacements object for the stored procedure execution
      const replacements = {
        InputJson: null, // Pass the JSON string as a parameter
        Delete: 1,
        Icode: Icode, // Set Delete flag to 0 for Create/Update (0 = false)
      };
      // eOnlineOrder] @orderData = :orderData,@order_cancel=:order_cancel,replacements)
      // Call the stored procedure for Create/Update
      const result = await this.executeSpForModel(
        '[dbo].[UpsertDoorDeliveryItem] @InputJson= :InputJson,@Delete= :Delete, @Icode = :Icode',
        replacements,
      );

      // Return the result through the callback
      callback(null, {
        success: 'OK',
        data: result,
        message: result[0]?.response_message,
        statusCode: 200,
      });
    } catch (error) {
      // Handle any errors and pass them to the callback
      callback(error);
    }
  }
}

module.exports = MenuModel;
