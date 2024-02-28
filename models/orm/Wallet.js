/**
 * 定義 Wallet 模型
 * 
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns {import('sequelize').ModelCtor}
 */
module.exports = (sequelize, DataTypes) => {
    const Wallet = sequelize.define('Wallet', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'User',
                key: 'id',
            }
        },
        balance: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                min: 0,
                isInt: true,
            },
            defaultValue: 0,
        },
    }, {
        tableName: 'wallets',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    Wallet.associate = function (models) {
        Wallet.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    };

    return Wallet;
};
