const { Sequelize, Op } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Load configuration based on NODE_ENV
const config = require('./config')[process.env.NODE_ENV || 'development'];
console.log('config', config);

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mssql',
  dialectModule: require('tedious'),
  port: config.port || 1433, // Default MSSQL port
  logging: false, // Disable logging for cleaner output
});

// Export Sequelize instance and Op operators
module.exports = {
  Op,
  sequelize,
};
