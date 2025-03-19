const express = require('express');
const router = express.Router();
const storeBranchController = require('../controllers/storeBranchController');
const validateRequest = require('../middlewares/validateRequest');
const { storeBranchSchema } = require('../validators/storeBranchValidator');

/**
 * Express router for store branch management.
 * Defines API endpoints with Swagger documentation.
 */

/**
 * @swagger
 * tags:
 *   name: StoreBranches
 *   description: API endpoints for managing store branches
 */

/**
 * @swagger
 * /api/storeBranches/create-branch:
 *   post:
 *     summary: Create a new store branch
 *     tags: [StoreBranches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brname:
 *                 type: string
 *                 example: "Branch A"
 *               location:
 *                 type: string
 *                 example: "Location A"
 *               city:
 *                 type: string
 *                 example: "City A"
 *               state:
 *                 type: string
 *                 example: "State A"
 *               region:
 *                 type: string
 *                 example: "Region A"
 *               reasonfordisabled:
 *                 type: string
 *                 example: "Renovation"
 *               enaDisTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-05T10:00:00Z"
 *               enaDisUsr:
 *                 type: string
 *                 example: "AdminUser"
 *     responses:
 *       200:
 *         description: Branch created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/create-branch', validateRequest(storeBranchSchema), storeBranchController.createBranch);

/**
 * @swagger
 * /api/storeBranches/update-branch/{brcode}:
 *   put:
 *     summary: Update an existing store branch
 *     tags: [StoreBranches]
 *     parameters:
 *       - in: path
 *         name: brcode
 *         required: true
 *         schema:
 *           type: integer
 *         description: The branch ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brname:
 *                 type: string
 *                 example: "Branch A Updated"
 *               location:
 *                 type: string
 *                 example: "New Location A"
 *               city:
 *                 type: string
 *                 example: "City A"
 *               state:
 *                 type: string
 *                 example: "State A"
 *               region:
 *                 type: string
 *                 example: "Region A"
 *               reasonfordisabled:
 *                 type: string
 *                 example: "Renovation Completed"
 *               enaDisTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-06T12:30:00Z"
 *               enaDisUsr:
 *                 type: string
 *                 example: "AdminUser"
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/update-branch/:brcode', validateRequest(storeBranchSchema), storeBranchController.updateBranch);

/**
 * @swagger
 * /api/storeBranches/delete-branch/{brcode}:
 *   delete:
 *     summary: Delete a store branch
 *     tags: [StoreBranches]
 *     parameters:
 *       - in: path
 *         name: brcode
 *         required: true
 *         schema:
 *           type: integer
 *         description: The branch ID to delete
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete-branch/:brcode', storeBranchController.deleteBranch);

/**
 * @swagger
 * /api/storeBranches/branches:
 *   get:
 *     summary: Get all store branches with optional search filters
 *     tags: [StoreBranches]
 *     parameters:
 *       - in: query
 *         name: brname
 *         schema:
 *           type: string
 *         description: Filter by branch name
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Filter by state
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Filter by region
 *     responses:
 *       200:
 *         description: List of store branches
 *       500:
 *         description: Internal server error
 */
router.get('/branches', storeBranchController.getAllBranches);

/**
 * Function to register store branch routes in the Express app.
 *
 * @param {Object} app - Express application instance.
 */
const storeBranchesRoutes = (app) => {
  app.use('/api/storeBranches', router);
};

// Exporting the function to integrate routes into the main app
module.exports = storeBranchesRoutes;
