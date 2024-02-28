'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('wallet_account_books', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            wallet_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'wallets',
                    key: 'id',
                },
            },
            transaction_type: {
                type: Sequelize.ENUM('deposit', 'withdraw', 'transfer'),
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            target_wallet_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'wallets',
                    key: 'id',
                },
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('wallet_account_books');
    }
};
