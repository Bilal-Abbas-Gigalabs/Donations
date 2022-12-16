const express = require("express");
const router = express.Router();
const CampaignController = require("../app/controllers/CampaignController");
const CurrencyController = require("../app/controllers/CurrencyController");

router.get("/campaigns", CampaignController.index);
router.post("/campaigns", CampaignController.store);
router.get("/campaigns/markAsFraud/:uuid", CampaignController.markAsFraud);

router.get("/currencies", CurrencyController.index);
router.get(
  "/campaigns/markAsFraudWithProcedure/:uuid",
  CampaignController.markAsFraudThroughProcedure
);

module.exports = router;
