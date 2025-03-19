const storeBranchService = require('../services/storeBranchService');
const logger = require('../../utils/logger');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Creates a new store branch by calling the stored procedure `sp_ManageStoreBranches` with `INSERT` operation.
 * @param {Object} req - Express request object containing branch details in the body.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success or error message.
 */
const createBranch = async (req, res) => {
  try {
    const query =
      'EXEC sp_ManageStoreBranches @operation=:operation, @brname=:brname, @location=:location, @city=:city, @state=:state, @region=:region, @reasonfordisabled=:reasonfordisabled, @enaDisTime=:enaDisTime, @enaDisUsr=:enaDisUsr';

    const replacements = {
      operation: 'INSERT',
      brname: req.body.brname,
      location: req.body.location,
      city: req.body.city,
      state: req.body.state,
      region: req.body.region,
      reasonfordisabled: req.body.reasonfordisabled || null,
      enaDisTime: req.body.enaDisTime || null,
      enaDisUsr: req.body.enaDisUsr || null,
    };

    const branch = await storeBranchService.executeSP(query, replacements);
    logger.info('New branch created:', { branch });
    return successResponse(res, 'Branch created successfully', branch);
  } catch (error) {
    logger.error('Error creating branch', { error });
    return errorResponse(res, 'Error creating branch');
  }
};

/**
 * Updates an existing store branch by calling the stored procedure `sp_ManageStoreBranches` with `UPDATE` operation.
 * @param {Object} req - Express request object containing branch details in the body and `brcode` in params.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success or error message.
 */
const updateBranch = async (req, res) => {
  try {
    const { brcode } = req.params;
    const query =
      'EXEC sp_ManageStoreBranches @operation=:operation, @brcode=:brcode, @brname=:brname, @location=:location, @city=:city, @state=:state, @region=:region, @reasonfordisabled=:reasonfordisabled, @enaDisTime=:enaDisTime, @enaDisUsr=:enaDisUsr';

    const replacements = {
      operation: 'UPDATE',
      brcode: brcode,
      brname: req.body.brname,
      location: req.body.location,
      city: req.body.city,
      state: req.body.state,
      region: req.body.region,
      reasonfordisabled: req.body.reasonfordisabled || null,
      enaDisTime: req.body.enaDisTime || null,
      enaDisUsr: req.body.enaDisUsr || null,
    };

    await storeBranchService.executeSP(query, replacements);
    logger.info(`Branch updated: ${brcode}`);
    return successResponse(res, 'Branch updated successfully');
  } catch (error) {
    logger.error('Error updating branch', { error });
    return errorResponse(res, 'Error updating branch');
  }
};

/**
 * Deletes a store branch by calling the stored procedure `sp_ManageStoreBranches` with `DELETE` operation.
 * @param {Object} req - Express request object containing `brcode` in params.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with success or error message.
 */
const deleteBranch = async (req, res) => {
  try {
    const { brcode } = req.params;
    const query = 'EXEC sp_ManageStoreBranches @operation=:operation, @brcode=:brcode';

    const replacements = {
      operation: 'DELETE',
      brcode: brcode,
    };

    await storeBranchService.executeSP(query, replacements);
    logger.info(`Branch deleted: ${brcode}`);
    return successResponse(res, 'Branch deleted successfully');
  } catch (error) {
    logger.error('Error deleting branch', { error });
    return errorResponse(res, 'Error deleting branch');
  }
};

/**
 * Retrieves all store branches by calling the service function `getAllBranches`.
 * @param {Object} req - Express request object containing optional query parameters.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with a list of branches or an error message.
 */
const getAllBranches = async (req, res) => {
  try {
    const branches = await storeBranchService.getAllBranches(req.query);
    logger.info('Branches fetched successfully', { branches });
    return successResponse(res, 'Branches fetched successfully', branches);
  } catch (error) {
    logger.error('Error fetching branches', { error });
    return errorResponse(res, 'Error fetching branches');
  }
};

// Exporting all branch management functions to be used in routes
module.exports = { createBranch, updateBranch, deleteBranch, getAllBranches };
