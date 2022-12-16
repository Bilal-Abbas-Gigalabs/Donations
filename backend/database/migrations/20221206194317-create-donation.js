'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Donations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            campaignId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Campaigns',
                    key: 'id'
                },
                allowNull: false,
            },
            currencyId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Currencies',
                    key: 'id'
                },
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING
            },
            amount: {
                type: Sequelize.DECIMAL(8, 2)
            },
            cryptoValue: {
                type: Sequelize.DECIMAL(8, 2)
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1,
                comment: '0=fraud | 1=valid'
            },
            createdAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Donations');
    }
};