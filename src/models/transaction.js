"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each Transaction belongs to one Personal identified by userUid
      Transaction.belongsTo(models.Personal, {
        foreignKey: "userUid",
        targetKey: "userUid",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Transaction.init(
    {
      transactionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
        primaryKey: true,
        allowNull: false,
      },
      userUid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: DataTypes.STRING,
      amount: {
        type: DataTypes.DECIMAL(10, 2), // 2 decimal places
        allowNull: false,
      },
      narration: DataTypes.STRING,
      transactionReference: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      timestamps: true, // default in Sequelize, but explicit is good
    }
  );
  return Transaction;
};
