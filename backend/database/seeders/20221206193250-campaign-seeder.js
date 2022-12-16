'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const records = [];

        // Create 100 records for random user ids (1-3)
        [...Array(100)].map((_, i) => {
            records.push({
                uuid: uuidv4(),
                userId: Math.floor(Math.random() * 3) + 1,
                name: 'Campaign ' + i,
                description: 'Some very random campaign',
                target: 1000,
                expiry: '2022-11-12',
            });
        });

        return queryInterface.bulkInsert('Campaigns', records);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
