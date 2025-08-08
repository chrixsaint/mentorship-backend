"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PersonalAccessToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalAccessToken.init(
    {
      token: DataTypes.STRING,
      expires_at: DataTypes.DATE,
      last_updated_at: DataTypes.DATE,
      tokenable_id: DataTypes.UUID,
      tokenable_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PersonalAccessToken",
    }
  );
  return PersonalAccessToken;
};
