const authMiddleware = require('../guards/auth');
const ERPAuthMiddleware = require('../guards/ERP_auth');
const OrderController = require('./controllers/order_controller');
const logger = require('../utils/logger');
const validateOrder = require('./validators/validator');

// some routes are commented which are on hold as of now...
const orderRoutes = (app, router) => {
  // order controller instances
  const orderControllers = new OrderController(logger, validateOrder);
  /**
   * @swagger
   * tags:
   *   name: Order
   *   description: Order management APIs
   */

  //   router.post(
  //     "/push/order",authMiddleware,
  //     orderController.pushOrder
  //   );
  // /**
  //  * @swagger
  //  * /api/v1/push/order:
  //  *   post:
  //  *     summary: Push Order
  //  *     tags: [Order]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               ShopCode:
  //  *                 type: string
  //  *               ItemDetails:
  //  *                 type: string
  //  *               BillAmt:
  //  *                 type: number
  //  *               OverallDiscountAmount:
  //  *                 type: number
  //  *               DiscountMaxCap:
  //  *                 type: number
  //  *               OnlineOrderId:
  //  *                 type: string
  //  *               ExternalOrderId:
  //  *                 type: string
  //  *               CpnCode:
  //  *                 type: string
  //  *               SPL_INSTRUCTIONS:
  //  *                 type: string
  //  *               CustMobNo:
  //  *                 type: string
  //  *               MySId:
  //  *                 type: string
  //  *     responses:
  //  *       200:
  //  *         description: Order pushed successfully
  //  *       401:
  //  *         description: Invalid credentials
  //  */

  router.post('/order/relay', ERPAuthMiddleware, orderControllers.orderRelay1.bind(orderControllers));

  /**
 /**
 * @swagger
 * /api/v1/order/relay:
 *   post:
 *     summary: Order Relay
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []  # This means the Bearer token is required for this endpoint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string  # You can change this to another type depending on your needs
 *     responses:
 *       200:
 *         description: relay api successfully
 *       401:
 *         description: Invalid credentials
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT  # This specifies that the token is a JWT
 */

  // router.post(
  //   "/order/edit",
  //   orderController.orderEdit
  // );

  router.post('/order/confirm', authMiddleware, orderControllers.orderConfirm.bind(orderControllers));

  /**
   * @swagger
   * /order/mark-food-ready:
   *   post:
   *     summary: Mark Food as Ready
   *     description: Endpoint to mark the food as ready for the given order based on the provided details.
   *     tags: [Order]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               timestamp:
   *                 type: string
   *                 format: date-time
   *                 example: "2018-06-28 11:49:18"
   *               swiggy_order_id:
   *                 type: integer
   *                 example: 1
   *               external_order_id:
   *                 type: string
   *                 example: "4798242761"
   *     responses:
   *       200:
   *         description: Food marked as ready successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Food marked as ready successfully"
   *       400:
   *         description: Bad request, missing or invalid fields
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid order details"
   *       401:
   *         description: Unauthorized, authentication failed
   *       404:
   *         description: Order not found for the provided order ID
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An unexpected error occurred"
   */

  router.post('/order/mark-food-ready', authMiddleware, orderControllers.orderMFR.bind(orderControllers));

  /**
   * @swagger
   * /api/v1/get-orders:
   *   get:
   *     summary: Get Order
   *     description: Endpoint to get orders based on provided details.
   *     tags: [Order]
   *     parameters:
   *       - in: query
   *         name: page
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *       - in: query
   *         name: limit
   *         required: true
   *         schema:
   *           type: integer
   *           example: 1
   *       - in: query
   *         name: getAll
   *         required: true
   *         schema:
   *           type: boolean
   *           example: false
   *       - in: query
   *         name: order_id
   *         required: false
   *         schema:
   *           type: string
   *           example: "104"
   *     responses:
   *       200:
   *         description: Order details fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Order details fetched successfully"
   *       400:
   *         description: Bad request, validation failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid order data"
   *       401:
   *         description: Unauthorized, user authentication failed
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An unexpected error occurred"
   */

  router.get('/get-orders', authMiddleware, orderControllers.getOrders.bind(orderControllers));

  // /**
  //  * @swagger
  //  * /order/confirm:
  //  *   post:
  //  *     summary: Confirm Order
  //  *     description: Endpoint to confirm an order based on provided details.
  //  *     tags: [Order]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               timestamp:
  //  *                 type: string
  //  *                 format: date-time
  //  *                 example: "2017-09-09 12:12:12"
  //  *               timestamp_outlet:
  //  *                 type: string
  //  *                 format: date-time
  //  *                 example: "2017-09-09 12:12:12"
  //  *               swiggy_order_id:
  //  *                 type: integer
  //  *                 example: 1
  //  *               external_order_id:
  //  *                 type: string
  //  *                 example: "1X"
  //  *               description:
  //  *                 type: string
  //  *                 example: "callback reason"
  //  *               metadata:
  //  *                 type: object
  //  *                 additionalProperties:
  //  *                   type: string
  //  *                 example:
  //  *                   xyz: "abc"
  //  *     responses:
  //  *       200:
  //  *         description: Order confirmed successfully
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 message:
  //  *                   type: string
  //  *                   example: "Order confirmed successfully"
  //  *       400:
  //  *         description: Bad request, validation failed
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 error:
  //  *                   type: string
  //  *                   example: "Invalid order data"
  //  *       401:
  //  *         description: Unauthorized, user authentication failed
  //  *       500:
  //  *         description: Internal server error
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 error:
  //  *                   type: string
  //  *                   example: "An unexpected error occurred"
  //  */

  /**
   * @swagger
   * /api/v1/cancel/order:
   *   post:
   *     summary: Cancel Order
   *     tags: [Order]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ShopCode:
   *                 type: string
   *               OnlineOrderNo:
   *                 type: string
   *               MySId:
   *                 type: string
   *               reason:          # Corrected indentation
   *                 type: string
   *     responses:
   *       200:
   *         description: Order canceled successfully
   *       401:
   *         description: Invalid credentials
   */

  router.post('/order/cancel', ERPAuthMiddleware, orderControllers.orderCancel.bind(orderControllers));

  /**
   * @swagger
   * /order/delivery-status:
   *   post:
   *     summary: Update Delivery Status
   *     description: Endpoint to update the delivery status of an order.
   *     tags: [Order]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               order_id:
   *                 type: integer
   *                 example: 1234
   *               status:
   *                 type: string
   *                 enum: [PICKEDUP, DELIVERED, OUT_FOR_DELIVERY, IN_TRANSIT, CANCELLED]
   *                 example: "PICKEDUP"
   *               timestamp:
   *                 type: string
   *                 format: date-time
   *                 example: "2018-06-22 12:55:23"
   *               de_details:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                     example: "Amar"
   *                   contact_number:
   *                     type: string
   *                     example: "7877777777"
   *                   alt_contact_number:
   *                     type: string
   *                     example: "9999999999"
   *     responses:
   *       200:
   *         description: Delivery status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Delivery status updated successfully"
   *       400:
   *         description: Bad request, validation failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid status or missing order details"
   *       401:
   *         description: Unauthorized, user authentication failed
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An unexpected error occurred"
   */

  router.post('/order/delivery-status', orderControllers.deliveryStatus.bind(orderControllers));

  /**
   * @swagger
   * /order/delivery/time-to-arrive:
   *   post:
   *     summary: Get Estimated Time for Delivery
   *     description: Endpoint to fetch the estimated time for delivery based on the provided order ID.
   *     tags: [Order]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               orderId:
   *                 type: integer
   *                 example: 1234
   *     responses:
   *       200:
   *         description: Successfully fetched the estimated delivery time
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 estimated_time:
   *                   type: string
   *                   format: date-time
   *                   example: "2024-12-02 15:30:00"
   *       400:
   *         description: Bad request, invalid or missing order ID
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Invalid order ID"
   *       401:
   *         description: Unauthorized, authentication failed
   *       404:
   *         description: Order not found for the provided ID
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "An unexpected error occurred"
   */

  router.post('/order/delivery/time-to-arrive', authMiddleware, orderControllers.deliveryTime.bind(orderControllers));
};

module.exports = orderRoutes;
