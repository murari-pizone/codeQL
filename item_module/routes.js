const authMiddleware = require('../guards/auth');
const itemController = require('./controllers/item_controller');
const logger = require('../utils/logger');
const validateItem = require('./validators/validator');

const itemRouted = (app, router) => {
  const itemcontrollers = new itemController(logger, validateItem);
  /**
   * @swagger
   * tags:
   *   - name: Item's Api
   *     description: Item management APIs
   */

  /**
   * @swagger
   * /api/v1/item-toggle:
   *   post:
   *     summary: Item Toggle
   *     tags: [Item's Api]  # Ensure the tag here matches the one defined above
   *     security:
   *       - BearerAuth: []  # Assuming JWT Bearer token authorization is required
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               restaurantId:
   *                 type: string
   *                 example: "1"
   *               externalItemIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                   example: "1"
   *               enable:
   *                 type: boolean
   *                 example: false
   *               fromTime:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-12-13T13:00:00Z"
   *               toTime:
   *                 type: string
   *                 format: date-time
   *                 example: "2024-12-13T14:10:00Z"
   *     responses:
   *       200:
   *         description: Successfully processed the request
   *       400:
   *         description: Invalid request body or parameters
   *       500:
   *         description: Internal server error
   */

  router.post('/item-toggle', authMiddleware, itemcontrollers.itemToggle.bind(itemcontrollers));
};

module.exports = itemRouted;
