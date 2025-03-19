const { sequelize } = require('../../config/db');
const logger = require('../../utils/logger');

/**
 * Executes a stored procedure with the given query and replacements.
 * Logs execution details and handles errors appropriately.
 *
 * @param {string} query - The SQL query to execute.
 * @param {object} replacements - The parameters to pass into the query.
 * @returns {Promise<object[]>} - The result of the stored procedure execution.
 */
const executeSP = async (query, replacements) => {
  try {
    logger.info('--- Executing Stored Procedure ----', { query, replacements });
    const result = await sequelize.query(query, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    });
    logger.info('--- Stored Procedure Execution Successful ----', { result });
    return result;
  } catch (error) {
    logger.error('Error executing Stored Procedure', { error });
    throw new Error('Database query execution failed: ' + error.message);
  }
};

/**
 * Retrieves all store branches with optional filters.
 *
 * Calls the stored procedure `sp_ManageStoreBranches` with a GET operation.
 *
 * @param {object} filters - Filtering parameters for retrieving branches.
 * @returns {Promise<object[]>} - List of store branches matching filters.
 */
const getAllBranches = async (filters) => {
  const query = `
        EXEC sp_ManageStoreBranches 
        @operation=:operation, 
        @brname=:brname, 
        @location=:location, 
        @city=:city, 
        @state=:state, 
        @region=:region`;

  const replacements = {
    operation: 'GET',
    brname: filters.brname || null,
    location: filters.location || null,
    city: filters.city || null,
    state: filters.state || null,
    region: filters.region || null,
  };

  return await executeSP(query, replacements);
};

module.exports = { executeSP, getAllBranches };
