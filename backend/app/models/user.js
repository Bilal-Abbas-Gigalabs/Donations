"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Campaign);
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      crypto_wallet_address: DataTypes.STRING,
      status: DataTypes.INTEGER, // Status are 1=active | 2=successful | 3=expired | 4=fraud
    },
    {sequelize, modelName: "User"}
  );

  return User;
};
