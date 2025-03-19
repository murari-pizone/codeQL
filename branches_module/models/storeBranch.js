const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

/**
 * Sequelize model definition for StoreBranch.
 * Represents store branch details in the database.
 */
const StoreBranch = sequelize.define(
  'storeBranch',
  {
    /**
     * Unique branch code (Primary Key, Auto Incremented)
     */
    brcode: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    /**
     * Branch name (Required)
     */
    brname: { type: DataTypes.STRING, allowNull: false },

    /**
     * Branch location (Required)
     */
    location: { type: DataTypes.STRING, allowNull: false },

    /**
     * Branch city (Required)
     */
    city: { type: DataTypes.STRING, allowNull: false },

    /**
     * Branch state (Required)
     */
    state: { type: DataTypes.STRING, allowNull: false },

    /**
     * Branch region (Required)
     */
    region: { type: DataTypes.STRING, allowNull: false },

    /**
     * Reason for disabling the branch (Optional)
     */
    reasonfordisabled: { type: DataTypes.STRING },

    /**
     * Enable/Disable timestamp (Optional)
     */
    enaDisTime: { type: DataTypes.DATE },

    /**
     * User who enabled/disabled the branch (Optional)
     */
    enaDisUsr: { type: DataTypes.STRING },
  },
  {
    /**
     * Enables automatic handling of createdAt and updatedAt timestamps.
     */
    timestamps: true,
  },
);

// Exporting the StoreBranch model to be used in other parts of the application
module.exports = StoreBranch;
