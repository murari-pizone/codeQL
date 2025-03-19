const authMiddleware = require('../guards/auth');
const menuController = require('./controllers/menu_controller');
const logger = require('../utils/logger');

const menuRoutes = (app, router) => {
  const menucontrollers = new menuController(logger);

  /**
   * @swagger
   * tags:
   *   name: Menu
   *   description: Menu management APIs
   */

  /**
   * @swagger
   * /api/v1/get-menu:
   *   post:
   *     summary: Retrieve menu for a specific outlet
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - Region
   *               - ShopCode
   *             properties:
   *               Region:
   *                 type: string
   *               ShopCode:
   *                 type: string
   *     responses:
   *       200:
   *         description: Menu retrieved successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  router.post('/get-menu', authMiddleware, menucontrollers.getMenuByOutlet.bind(menucontrollers));

  //     /**
  //  * @swagger
  //  * /api/v1/get-menu/category-timing:
  //  *   post:
  //  *     summary: Retrieve category timing for a specific outlet
  //  *     tags: [Menu]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             required:
  //  *               - Region
  //  *               - ShopCode
  //  *             properties:
  //  *               Region:
  //  *                 type: string
  //  *               ShopCode:
  //  *                 type: string
  //  *     responses:
  //  *       200:
  //  *         description: Category timing retrieved successfully
  //  *       400:
  //  *         description: Invalid input
  //  *       500:
  //  *         description: Internal server error
  //  */
  //     router.post("/get-menu/category-timing",authMiddleware, menuOfOutlet.menuCategoryTiming);

  /**
   * @swagger
   * /api/v1/full-menu:
   *   post:
   *     summary: Sync menu for a specific outlet
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - ShopCode
   *             properties:
   *               ShopCode:
   *                 type: string
   *     responses:
   *       200:
   *         description: Menu synced successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Internal server error
   */
  router.post('/full-menu', authMiddleware, menucontrollers.menuSyncLogic.bind(menucontrollers));
  // /**
  //  * @swagger
  //  * /api/v1/full-menu:
  //  *   post:
  //  *     summary: Sync menu for a given outlet
  //  *     description: This endpoint synchronizes the menu for the outlet based on the provided `ShopCode`.
  //  *     tags: [Menu]
  //  *     security:
  //  *       - bearerAuth: []
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               ShopCode:
  //  *                 type: integer
  //  *                 description: The unique identifier for the outlet/shop.
  //  *                 example: 2
  //  *     responses:
  //  *       200:
  //  *         description: Successfully synchronized menu data for the outlet
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 status:
  //  *                   type: string
  //  *                   description: The status of the operation.
  //  *                   example: "success"
  //  *                 message:
  //  *                   type: string
  //  *                   description: A message indicating the result of the menu synchronization.
  //  *                   example: "Menu synchronized successfully for ShopCode 2"
  //  *       400:
  //  *         description: Bad request due to invalid or missing data
  //  *       401:
  //  *         description: Unauthorized request (missing or invalid JWT token)
  //  *       500:
  //  *         description: Internal server error
  //  */

  // router.post('/verify-data',authMiddleware, menuOfOutlet.verifySyncMenuData);

  // /**
  //  * @swagger
  //  * /api/v1/verify-data:
  //  *   post:
  //  *     summary: Verify and synchronize menu data for given shop codes
  //  *     description: This endpoint verifies and synchronizes the menu data for the provided `ShopCode` values.
  //  *     tags: [Menu]
  //  *     security:
  //  *       - bearerAuth: []
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
  //  *                   type: integer
  //  *                   description: The unique identifier for the shop/outlet.
  //  *                   example: 1
  //  *               required:
  //  *                 - ShopCode
  //  *     responses:
  //  *       200:
  //  *         description: Successfully verified and synchronized the menu data for the provided shop codes
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 success:
  //  *                   type: boolean
  //  *                   description: Indicates if the operation was successful.
  //  *                   example: true
  //  *                 message:
  //  *                   type: string
  //  *                   description: A message indicating the result of the menu synchronization.
  //  *                   example: "Menu data successfully verified and synced for all provided shop codes."
  //  *       400:
  //  *         description: Bad request due to invalid or missing data
  //  *       401:
  //  *         description: Unauthorized request (missing or invalid JWT token)
  //  *       500:
  //  *         description: Internal server error
  //  */
  router.get('/sync-error', authMiddleware, menucontrollers.syncMenuError.bind(menucontrollers));

  /**
   * @swagger
   * /api/v1/sync-error:
   *   post:
   *     summary: Handle menu synchronization errors for a given outlet
   *     description: This endpoint is used to report or handle synchronization errors for a specific outlet, identified by its `ShopCode`.
   *     tags: [Menu]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - ShopCode
   *               - errorMessage
   *             properties:
   *               ShopCode:
   *                 type: integer
   *                 description: The unique identifier for the outlet/shop reporting the synchronization error.
   *                 example: 2
   *               errorMessage:
   *                 type: string
   *                 description: A description of the synchronization error.
   *                 example: "Menu data failed to sync due to network issue."
   *     responses:
   *       200:
   *         description: Successfully handled the synchronization error for the given outlet
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   description: Indicates if the operation was successful.
   *                   example: true
   *                 message:
   *                   type: string
   *                   description: A message indicating the result of handling the sync error.
   *                   example: "Synchronization error successfully reported for ShopCode 2."
   *       400:
   *         description: Bad request due to invalid or missing data
   *       401:
   *         description: Unauthorized request (missing or invalid JWT token)
   *       500:
   *         description: Internal server error
   */

  //    router.post('/publish',authMiddleware, menuOfOutlet.publishSyncMenu);
  //    router.get('/verify-status',authMiddleware, menuOfOutlet.verifyStatusSyncMenu);

  router.post('/sync-menu/track', authMiddleware, menucontrollers.syncMenuTrack.bind(menucontrollers));

  router.post('/create-item', authMiddleware, menucontrollers.createItem.bind(menucontrollers));
  router.delete('/remove-item', authMiddleware, menucontrollers.removeItem.bind(menucontrollers));
};

module.exports = menuRoutes;
