"use strict";
const {make, regex} = require("simple-body-validator");
const {Campaign, User, Donation, Currency} = require("../models");
const _ = require("lodash");
const {Sequelize} = require("sequelize");
const CurrencyService = require("../../../services/CurrencyService");
const db = require("../models");

class CampaignController {
  constructor() {
    this.index = this.index.bind(this);
    this.store = this.store.bind(this);
    this.markAsFraud = this.markAsFraud.bind(this);
  }

  async index(request, response) {
    const page = parseInt(request.query.page);
    const perPage = parseInt(request.query.perPage);

    const data = await Campaign.findAndCountAll({
      where: {status: 1},
      offset: (page - 1) * perPage,
      limit: perPage,
    });

    const pagination = {
      total: data.count,
      perPage: perPage,
      currentPage: page,
      nextPage: null,
      lastPage: Math.ceil(data.count / perPage),
    };

    if (pagination.currentPage + 1 <= pagination.lastPage) {
      pagination.nextPage = pagination.currentPage + 1;
    } else {
      pagination.nextPage = null;
    }

    return response.json({
      status: 200,
      data: {
        pagination: pagination,
        items: data.rows,
      },
    });
  }

  async store(request, response) {
    const validator = make(request.body, {
      campaignId: ["required"],
      currencyId: ["required"],
      nickname: ["required", "alpha_dash"],
      amount: ["required", regex(/^[0-9]*(\.[0-9]{0,2})?$/)],
    });

    if (!validator.validate()) {
      return response.json({
        status: 422,
        errors: validator.errors().all(),
      });
    }

    const data = {
      campaignId: request.body.campaignId,
      currencyId: request.body.currencyId,
      nickname: request.body.nickname,
      amount: request.body.amount,
    };

    // If currency type is 'bitcoin'
    // call the external api to get the amount in USD
    const currency = await Currency.findOne({
      where: {id: request.body.currencyId},
    });
    if (currency.type === "crypto") {
      const exchangeResponse = await CurrencyService.exchangeCurrency(
        request.body.amount,
        currency.code
      );
      data["cryptoValue"] = exchangeResponse.result;
    }

    // Create a new donation for the campaign
    await Donation.create(data);

    // Get the target and collected amount from campaign and their 'valid' donations
    const campaign = await Campaign.findAll({
      where: {id: request.body.campaignId},
      attributes: [
        "target",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_col"],
      ],
      include: [
        {
          model: Donation,
          attributes: [],
          where: {status: 1},
        },
      ],
      group: "Donations.amount",
      raw: true,
    });

    let collection = 0;
    let target = 0;
    campaign.forEach((camp, i) => {
      target = camp.target;
      collection = camp.total_col;
    });

    // Check if target is reached, set campaign status to 'successful'
    if (collection >= target) {
      await Campaign.update(
        {status: 2},
        {where: {id: request.body.campaignId}}
      );
    }

    return response.json({
      status: 200,
      message: "Successfully created!",
    });
  }

  async markAsFraud(request, response) {
    const validator = make(request.params, {
      uuid: ["required", "string"],
    });

    if (!validator.validate()) {
      return response.json({
        status: 422,
        errors: validator.errors().all(),
      });
    }

    // Find campaign by uuid
    const campaign = await Campaign.findOne({
      where: {uuid: request.params.uuid},
      include: {
        model: User,
        include: [
          {
            model: Campaign,
            include: [Donation],
          },
        ],
      },
    });

    if (campaign) {
      const campaignUser = campaign.User;
      const campaigns = _.map(campaignUser.Campaigns, "id");

      // Mark the campaign owner, their campaigns and respective donations as 'fraud'
      await campaignUser.update({status: 0});
      await Campaign.update({status: 4}, {where: {id: campaigns}});
      await Donation.update({status: 0}, {where: {campaignId: campaigns}});

      return response.json({
        status: 200,
        message: "Successfully marked!",
      });
    }

    return response.json({
      status: 404,
      message: "Campaign not found!",
    });
  }

  async markAsFraudThroughProcedure(req, res) {
    const campaignID = req.params.uuid;
    db.sequelize
      .query(`CALL markAsFraud('${campaignID}');`)
      .then(function (response) {
        res.json(response);
      })
      .catch(function (err) {
        res.json(err);
      });
    //   ***********Please register/execute this within the database*************.
    // -- DROP PROCEDURE markAsFraud;
    // DELIMITER // ;
    // CREATE PROCEDURE markAsFraud(IN campaignUUID varchar(255))
    // BEGIN
    // update Campaigns
    // SET status = '4' where uuid = campaignUUID;
    // SET @userId = (SELECT userId from Campaigns where uuid = campaignUUID);
    // update Users
    // SET status = '4' where id = @userId;
    // update Campaigns
    // SET status = '4' where userId = @userId;
    // update Donations LEFT JOIN Campaigns on Campaigns.id = Donations.campaignId
    // SET Donations.status = '4'
    // where Campaigns.userId = @userId;
    // END;
    // -- CALL markAsFraud(exampleCampaignID);
  }
}

module.exports = new CampaignController();
