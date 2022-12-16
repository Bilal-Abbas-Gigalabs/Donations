'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Users', [
            {
                username: 'Owner1',
                crypto_wallet_address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
            },
            {
                username: 'Owner2',
                crypto_wallet_address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
            },
            {
                username: 'Owner3',
                crypto_wallet_address: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
            }
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
