"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TempSignupCodes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TempSignupCodes.init(
    {
      userEmail: DataTypes.STRING,
      signupCode: DataTypes.STRING,
      timeCreated: DataTypes.DATE,
      numberOfTrials: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TempSignupCodes",
    }
  );
  return TempSignupCodes;
};
