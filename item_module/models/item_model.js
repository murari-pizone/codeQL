const { headerBody, apiERPEndPoint } = require('../../helpers/common_header');
// const{ contentBody }  = require('../../helpers/common_header');
// const constant = require('../constant');
require('dotenv').config();
const axios = require('axios');
class ItemModule {
  constructor(logger) {
    this.logger = logger;
  }

  async itemToggle(req, callback) {
    try {
      // const body = req.body;
      const SWIGGY_URL = process.env.SWIGGY_URL + apiERPEndPoint().s_itemToggle;
      const header_body = headerBody();
      const content_body = req?.body;
      const response = await axios.post(SWIGGY_URL, content_body, {
        headers: header_body,
      });

      callback(null, response?.data);
    } catch (error) {
      callback(null, error);
    }
  }
}
module.exports = ItemModule;
