const express = require('express');
const menuRoutes = require('../menu_Module/routes');
const router = express.Router();
const outletRoutes = require('../Outlets_Module/routes');
const orderRoutes = require('../orders_module/routes');
const itemRoutes = require('../item_module/routes');
const storeBranchesRoutes = require('../branches_module/routes/storeBranchRoutes');

module.exports = (app) => {
  app.use('/api/v1/', router);
  outletRoutes(app, router);
  menuRoutes(app, router);
  orderRoutes(app, router);
  itemRoutes(app, router);
  storeBranchesRoutes(app, router);
};
