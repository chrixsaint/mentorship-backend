"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each Balance belongs to one Personal identified by userUid
      Balance.belongsTo(models.Personal, {
        foreignKey: "userUid",
        targetKey: "userUid",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Balance.init(
    {
      balanceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
        primaryKey: true,
        allowNull: false,
      },
      userUid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      balance1: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      balance2: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      userEmail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Balance",
      timestamps: true,
    }
  );

  return Balance;
};
