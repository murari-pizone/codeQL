'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a new column to a table
    await queryInterface.addColumn('MenuSynchDetails', 'Sync_Status', {
      type: Sequelize.STRING, // Change type as necessary
      allowNull: true, // Set allowNull if necessary
    });
  },

  down: async (queryInterface) => {
    // Remove the column in case of rollback
    await queryInterface.removeColumn('MenuSynchDetails', 'Sync_Status');
  },
};
