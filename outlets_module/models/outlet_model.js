const logger = require('../../utils/logger');
const { sequelize } = require('../../config/db');
const { headerBody, apiERPEndPoint } = require('../../helpers/common_header');
const axios = require('axios');

class OutletModel {
  constructor() {
    this.logger = logger;
  }

  async getOutlets(req, key, callback) {
    try {
      console.log(req, key);
      const replacements = {};
      const result = await this.executeSP('[dbo].[mw_GetAllBranches]', replacements);

      callback(null, {
        success: 'OK',
        data: result,
        message: '',
        statusCode: 200,
      });
    } catch (error) {
      callback(error);
    }
  }
  async createOutlet(req, key, callback) {
    try {
      // Destructure the relevant fields from the request body
      const data = req?.body;

      // Prepare the JSON object to pass to the stored procedure
      const inputJson = data;

      // Prepare the replacements object for the stored procedure execution
      const replacements = {
        InputJson: JSON.stringify(inputJson), // Pass the JSON string as a parameter
        Delete: 0,
        brcode: null, // Set Delete flag to 0 for Create/Update (0 = false)
      };

      // Call the stored procedure for Create/Update
      const result = await this.executeSP(
        '[dbo].[UpsertDoorDeliveryBranch] @InputJson= :InputJson,@Delete= :Delete, @brcode= :brcode',
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

  async removeOutlet(req, key, callback) {
    try {
      // Destructure the relevant fields from the request body
      const data = req?.body;

      // Prepare the JSON object to pass to the stored procedure
      const brcode = data.brcode;

      // Prepare the replacements object for the stored procedure execution
      const replacements = {
        InputJson: null, // Pass the JSON string as a parameter
        Delete: 1,
        brcode: brcode, // Set Delete flag to 0 for Create/Update (0 = false)
      };
      // eOnlineOrder] @orderData = :orderData,@order_cancel=:order_cancel,replacements)
      // Call the stored procedure for Create/Update
      const result = await this.executeSP(
        '[dbo].[UpsertDoorDeliveryBranch] @InputJson= :InputJson,@Delete= :Delete, @brcode = :brcode',
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

  async getRegion(req, key, callback) {
    try {
      const replacements = {};
      const result = await this.executeSP('[dbo].[mw_GetBranchRegion]', replacements);
      const region = {
        regions: JSON.parse(result[0]?.regions),
        outlets: JSON.parse(result[0]?.outlets),
      };
      callback(null, {
        success: 'OK',
        data: region,
        message: '',
        statusCode: 200,
      });
    } catch (error) {
      callback(error);
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

  async storeToggle(req, callback) {
    try {
      const SWIGGY_URL = process.env.SWIGGY_URL + apiERPEndPoint().s_storToggle;
      const header_body = headerBody();
      const content_body = req?.body;
      const response = await axios.post(SWIGGY_URL, content_body, {
        headers: header_body,
      });
      callback(null, response?.data);
    } catch (error) {
      this.logger.error('Error in store toggle', { err: error });
      callback(new Error('Error in store toggle' + error.message));
    }
  }
}

module.exports = OutletModel;
