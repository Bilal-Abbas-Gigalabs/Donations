## Prerequists

1. Node > 14
2. Mysql
3. Sequelize and sequelize-cli
4. Nodemon(optional)
5. Create .env file and update the respective values

## Installation

```bash
npm install
```

## Migrate database

```bash
npx sequelize-cli db:migrate
```

## Add data from seeds

```bash
npx sequelize-cli db:seed:all
```

## Start Server

```bash
npm run dev
or
nodemon serve
```

## Register fraud procedure

```bash
-- DROP PROCEDURE markAsFraud;
DELIMITER // ;
CREATE PROCEDURE markAsFraud(IN campaignUUID varchar(255))
BEGIN
update Campaigns
SET status = '4' where uuid = campaignUUID;
SET @userId = (SELECT userId from Campaigns where uuid = campaignUUID);
update Users
SET status = '4' where id = @userId;
update Campaigns
SET status = '4' where userId = @userId;
update Donations LEFT JOIN Campaigns on Campaigns.id = Donations.campaignId
SET Donations.status = '4'
where Campaigns.userId = @userId;
END;
-- CALL markAsFraud(exampleCampaignID);
```
