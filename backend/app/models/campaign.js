"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
      this.hasMany(models.Donation);
    }
  }
  Campaign.init(
    {
      uuid: DataTypes.UUID,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      target: DataTypes.DECIMAL(16, 2),
      expiry: DataTypes.DATE,
      status: DataTypes.INTEGER, // Status are 1=active | 2=successful | 3=expired | 4=fraud
    },
    {sequelize, modelName: "Campaign"}
  );

  return Campaign;
};
