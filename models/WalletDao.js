const {Sequelize} = require('sequelize');
class WalletDao {

    static TRANS_DEPOSIT = 'deposit';
    static TRANS_WITHDRAW = 'withdraw';
    static TRANS_TRANSFER = 'transfer';

    constructor() {
        this.Wallet = require('./orm').Wallet;
        this.User = require('./orm').User;
        this.WalletAccountBook = require('./orm').WalletAccountBook;    
    }

    /**
     * 取得錢包資訊
     * 
     * @param {number} userId,
     * @param {boolean} includeAccountBooks 是否包含交易紀錄
     * @returns 
     */
    async getWalletInfo(userId, includeAccountBooks = true) {
        let includes = [];
        if(includeAccountBooks) {
            includes.push({
                model: this.WalletAccountBook,
                as: 'accountBooks',
                include: [
                    {
                        model: this.Wallet,
                        as: 'targetWallet',
                        include: {
                            model: this.User,
                            as: 'user',
                        }
                    },
                    {
                        model: this.Wallet,
                        as: 'wallet',
                        include: {
                            model: this.User,
                            as: 'user',
                        }
                    }
                ]
            });
        }

        try {
            const wallet = await this.Wallet.findOne({
                where: { user_id: userId },
                include: includes
            });
            return wallet;
        } catch (error) {
            console.error('Error finding wallet by userId:', error);
            throw error;
        }
    }

    /**
     * 根據不同的交易類型更新錢包餘額
     * 
     * @param {number} walletId 欲操作的錢包 ID
     * @param {string} transactionType WalletDao.TRANS_DEPOSIT or WalletDao.TRANS_WITHDRAW or WalletDao.TRANS_TRANSFER
     * @param {number} amount 交易金額
     * @param {number|null} targetWalletId 如果是轉帳 WalletDao.TRANS_TRANSFER，則需要提供目標錢包的 ID
     * @returns
     */
    async recordTransaction(walletId, transactionType, amount, targetWalletId = null) {

        if (transactionType == WalletDao.TRANS_TRANSFER) {
            if (targetWalletId === null) {
                throw new Error('Target wallet ID is required for transfer transaction');
            }
        }

        const dbTrans = await this.Wallet.sequelize.transaction();
        try {

            //讓資料庫進行金額操作
            switch (transactionType) {
                case WalletDao.TRANS_DEPOSIT:
                    await this.Wallet.update({
                        balance: this.Wallet.sequelize.literal(`balance + ${amount}`)
                    }, {
                        where: { id: walletId },
                        transaction: dbTrans,
                    });
                    break;
                case WalletDao.TRANS_WITHDRAW:
                    await this.Wallet.update({
                        balance: this.Wallet.sequelize.literal(`balance - ${amount}`)
                    }, {
                        where: {
                            id: walletId,
                            //balance 必須大於等於 amount
                            balance: {
                                [Sequelize.Op.gte]: amount
                            }
                        },
                        transaction: dbTrans,
                    });
                    break;
                case WalletDao.TRANS_TRANSFER:
                    await this.Wallet.update({
                        balance: this.Wallet.sequelize.literal(`balance - ${amount}`)
                    }, {
                        where: {
                            id: walletId,
                            //balance 必須大於等於 amount
                            balance: {
                                [Sequelize.Op.gte]: amount
                            }
                        },
                        transaction: dbTrans,
                    });
                    await this.Wallet.update({
                        balance: this.Wallet.sequelize.literal(`balance + ${amount}`)
                    }, {
                        where: { id: targetWalletId },
                        transaction: dbTrans,
                    });

                    //紀錄交易（接受方）
                    await this.WalletAccountBook.create({
                        wallet_id: targetWalletId,
                        transaction_type: WalletDao.TRANS_DEPOSIT,
                        amount: amount,
                        target_wallet_id: walletId,
                    }, { transaction: dbTrans });

                    break;
            }

            //紀錄交易
            await this.WalletAccountBook.create({
                wallet_id: walletId,
                transaction_type: transactionType,
                amount: amount,
                target_wallet_id: targetWalletId,
            }, { transaction: dbTrans });

            await dbTrans.commit();
        } catch (error) {
            await dbTrans.rollback();
            console.error('Error transaction:', error);
            throw error;
        }
    }

}

module.exports = WalletDao;