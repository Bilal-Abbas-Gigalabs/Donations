'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Currencies', [
            {
                name: 'United States Dollar',
                code: 'USD',
                symbol: '$',
                type: 'normal',
            },
            {
                name: 'United Kingdom Pound',
                code: 'GBP',
                symbol: '£',
                type: 'normal',
            },
            {
                name: 'Bitcoin',
                code: 'BTC',
                symbol: '₿',
                type: 'crypto',
            },
        ]);
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
