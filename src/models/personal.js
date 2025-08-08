"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Personal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Personal can have many Balances (1:N)
      Personal.hasMany(models.Balance, {
        foreignKey: "userUid", // Foreign key in Balance model
        sourceKey: "userUid", // Primary key in Personal model
        as: "balances", // Alias for easier inclusion
        onDelete: "CASCADE", // If Personal is deleted, delete balances
        onUpdate: "CASCADE",
      });

      //  New association: A Personal can have many Transactions (1:N)
      Personal.hasMany(models.Transaction, {
        foreignKey: "userUid", // This is the foreign key in the Transaction model
        sourceKey: "userUid", // This is the primary key in the Personal model
        as: "transactions", // Optional alias for easier inclusion
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Personal.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      country: DataTypes.STRING,
      userEmail: DataTypes.STRING,
      password: DataTypes.STRING,
      userUid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Default to a UUID value
        allowNull: false,
        primaryKey: true, // Keep userUid as the primary key
        unique: true, // Ensures userUid is unique
      },
      profileStatus: DataTypes.BOOLEAN,
      lastLoginCode: DataTypes.INTEGER,
      accountType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Personal",
    }
  );
  return Personal;
};
