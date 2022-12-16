"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Campaign);
      this.belongsTo(models.Currency);
    }
  }

  Donation.init(
    {
      campaignId: DataTypes.INTEGER,
      currencyId: DataTypes.INTEGER,
      nickname: DataTypes.STRING,
      amount: DataTypes.DECIMAL(16, 2),
      cryptoValue: DataTypes.DECIMAL(16, 2),
      status: DataTypes.INTEGER, // Status are 1=active | 2=successful | 3=expired | 4=fraud
    },
    {sequelize, modelName: "Donation"}
  );

  return Donation;
};
