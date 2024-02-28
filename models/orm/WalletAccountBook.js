/**
 * WalletAccountBook ORM
 * 
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {import('sequelize').Model}
 */
module.exports = (sequelize, DataTypes) => {
    const WalletAccountBook = sequelize.define('WalletAccountBook', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        wallet_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'wallets',
                key: 'id',
            },
        },
        transaction_type: {
            type: DataTypes.ENUM,
            values: ['deposit', 'withdraw', 'transfer'],
            allowNull: false,
            validate: {
                isIn: [['deposit', 'withdraw', 'transfer']],
            },
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        target_wallet_id: {
            type: DataTypes.INTEGER,
            // 若是轉帳交易，則需要提供目標錢包的 ID
            // 若是轉帳產生的儲值，則需要提供目標錢包的 ID
            allowNull: true,
            references: {
                model: 'wallets',
                key: 'id',
            },
        },
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'wallet_account_books',
        timestamps: false,
    });

    WalletAccountBook.associate = function (models) {
        WalletAccountBook.belongsTo(models.Wallet, {foreignKey: 'wallet_id', as: 'wallet'});
        WalletAccountBook.belongsTo(models.Wallet, {foreignKey: 'target_wallet_id', as: 'targetWallet'});
    };

    return WalletAccountBook;
};
