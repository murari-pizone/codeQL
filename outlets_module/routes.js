const authMiddleware = require('../guards/auth');
const outlet_controller = require('./controllers/outlet_controller');
const logger = require('../utils/logger');

const outletRoutes = (app, router) => {
  const outletController = new outlet_controller(logger);

  /**
   * @swagger
   * tags:
   *   name: Outlets
   *   description: Outlets management APIs
   */

  /**
   * @swagger
   * /api/v1/outlet/get-outlets:
   *   get:
   *     summary: Retrieve all outlets
   *     tags: [Outlets]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of outlets
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   Region:
   *                     type: string
   *                   ShopCode:
   *                     type: string
   *                   description:
   *                     type: string
   *       500:
   *         description: Internal server error
   */
  router.get('/get-outlets', authMiddleware, outletController.getAllOutlets.bind(outletController));
  router.post('/create-outlet', authMiddleware, outletController.createOutlet.bind(outletController));
  router.delete('/remove-outlet', authMiddleware, outletController.removeOutlet.bind(outletController));
  //   /**
  //  * @swagger
  //  * /api/v1/outlet/getall-filter:
  //  *   post:
  //  *     summary: Retrieve filtered outlet data
  //  *     description: This endpoint retrieves filtered outlet data based on location, city, and region. The filter fields can be empty arrays.
  //  *     tags: [Outlets]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               location:
  //  *                 type: array
  //  *                 items:
  //  *                   type: string
  //  *                 description: The list of locations to filter by. Can be an empty array.
  //  *                 example: []
  //  *               city:
  //  *                 type: array
  //  *                 items:
  //  *                   type: string
  //  *                 description: The list of cities to filter by. Can be an empty array.
  //  *                 example: []
  //  *               region:
  //  *                 type: array
  //  *                 items:
  //  *                   type: string
  //  *                 description: The list of regions to filter by. Can be an empty array.
  //  *                 example: []
  //  *     responses:
  //  *       200:
  //  *         description: Successfully retrieved filtered outlets data
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 status:
  //  *                   type: string
  //  *                   description: Status of the operation
  //  *                   example: "success"
  //  *                 data:
  //  *                   type: array
  //  *                   items:
  //  *                     type: object
  //  *                     properties:
  //  *                       ShopCode:
  //  *                         type: string
  //  *                         example: "6"
  //  *                       Region:
  //  *                         type: string
  //  *                         example: "CHI"
  //  *                       Location:
  //  *                         type: string
  //  *                         example: "Downtown"
  //  *                       City:
  //  *                         type: string
  //  *                         example: "Chicago"
  //  *       400:
  //  *         description: Bad request due to invalid or missing data
  //  *       500:
  //  *         description: Internal server error
  //  *     security:
  //  *       - bearerAuth: []
  //  */

  //   router.get( "/outlet/get-filter",authMiddleware,getAllOutlets.getAllFilterValue );
  // /**
  //  * @swagger
  //  * /api/v1/outlet/get-filter:
  //  *   get:
  //  *     summary: Retrieve all filters for outlets
  //  *     description: Fetches all the available filter values for outlets.
  //  *     tags: [Outlets]
  //  *     security:
  //  *       - bearerAuth: []
  //  *     responses:
  //  *       200:
  //  *         description: A list of filter values for outlets
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: array
  //  *               items:
  //  *                 type: object
  //  *                 properties:
  //  *                   Region:
  //  *                     type: string
  //  *                     description: The region where the outlet is located.
  //  *                   ShopCode:
  //  *                     type: string
  //  *                     description: The unique shop code identifier for the outlet.
  //  *                   Description:
  //  *                     type: string
  //  *                     description: A brief description of the outlet.
  //  *       400:
  //  *         description: Bad request due to invalid parameters or missing data
  //  *       500:
  //  *         description: Internal server error
  //  */
  //   router.post( "/outlet/get-data",authMiddleware,getAllOutlets.pullFromERP );

  //   /**
  //  * @swagger
  //  * /api/v1/outlet/get-data:
  //  *   post:
  //  *     summary: Retrieve data for outlets
  //  *     description: This endpoint pulls data from ERP for the given list of outlets.
  //  *     tags: [Outlets]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: array
  //  *             items:
  //  *               type: object
  //  *               properties:
  //  *                 ShopCode:
  //  *                   type: string
  //  *                   description: The unique code for the outlet.
  //  *                   example: "6"
  //  *                 Region:
  //  *                   type: string
  //  *                   description: The region where the outlet is located.
  //  *                   example: "CHI"
  //  *     responses:
  //  *       200:
  //  *         description: Successfully retrieved data from ERP for the given outlets.
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 status:
  //  *                   type: string
  //  *                   description: Status of the operation
  //  *                   example: "success"
  //  *                 data:
  //  *                   type: array
  //  *                   items:
  //  *                     type: object
  //  *                     properties:
  //  *                       ShopCode:
  //  *                         type: string
  //  *                         example: "6"
  //  *                       Region:
  //  *                         type: string
  //  *                         example: "CHI"
  //  *                       additionalData:
  //  *                         type: string
  //  *                         example: "Data from ERP"
  //  *       400:
  //  *         description: Bad request due to invalid or missing data
  //  *       500:
  //  *         description: Internal server error
  //  *     security:
  //  *       - bearerAuth: []
  //  */

  /**
   * @swagger
   * /api/v1/store-toggle:
   *   post:
   *     summary: store Toggle
   *     tags: [Store Timing Api]  # Ensure the tag here matches the one defined above
   *     security:
   *       - BearerAuth: []  # Assuming JWT Bearer token authorization is required
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               partnerid:
   *                 type: string
   *                 example: "1"
   *               isRequestedToOpen:
   *                 type: boolean
   *                 example: false
   *     responses:
   *       200:
   *         description: Successfully processed the request
   *       400:
   *         description: Invalid request body or parameters
   *       500:
   *         description: Internal server error
   */
  router.post('/store-toggle', outletController.storeToggle.bind(outletController));
  // authMiddleware
  router.get('/sync', outletController.GetAllBranchRegion.bind(outletController));
};
module.exports = outletRoutes;
