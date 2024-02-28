const WalletDao = require('../models/WalletDao');
const ValidationError = require('../system/exceptions/ValidationError');

class WalletService {

    constructor() {
        this.walletDao = new WalletDao();
    }

    /**
     * 取得錢包詳細資訊
     * 
     * @param {int} userId 
     * @returns 
     */
    async getWalletInfo(userId) {
        const wallet = await this.walletDao.getWalletInfo(userId);

        let parsedAccountBooks = wallet.accountBooks.map((accountBook) => {
            let parsedAccountBook = {
                'type': accountBook.transaction_type,
                'amount': accountBook.amount,
                'createdAt': accountBook.created_at,
                'updatedAt': accountBook.updated_at
            };
            if (accountBook.targetWallet) {
                parsedAccountBook['targetWallet'] = {
                    'username': accountBook.targetWallet.user.username
                };
            }
            return parsedAccountBook;
        });

        
        return {
            'balance': wallet.balance,
            'accountBooks': parsedAccountBooks,
            'createdAt': wallet.created_at,
            'updatedAt': wallet.updated_at
        };
    }

    /**
     * 使用者存款
     * 
     * @param {int} userId 
     * @param {int} amount 
     */
    async deposit(userId, amount) {
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }
        const wallet = await this.walletDao.getWalletInfo(userId, false);
        await this.walletDao.recordTransaction(wallet.id, WalletDao.TRANS_DEPOSIT, amount);
    }

    /**
     * 使用者提款
     * 
     * @param {int} userId 
     * @param {int} amount 
     */
    async withdraw(userId, amount) {
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }
        const wallet = await this.walletDao.getWalletInfo(userId, false);
        if (wallet.balance < amount) {
            throw new ValidationError('Insufficient balance');
        }
        await this.walletDao.recordTransaction(wallet.id, WalletDao.TRANS_WITHDRAW, amount);
    }

    /**
     * 使用者轉帳
     * 
     * @param {int} userId 
     * @param {int} targetUserId
     * @param {int} amount 
     */
    async transfer(userId, targetUserId, amount) {
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }
        const wallet = await this.walletDao.getWalletInfo(userId, false);
        if (wallet.balance < amount) {
            throw new ValidationError('Insufficient balance');
        }
        const targetWallet = await this.walletDao.getWalletInfo(targetUserId, false);
        await this.walletDao.recordTransaction(wallet.id, WalletDao.TRANS_TRANSFER, amount, targetWallet.id);
    }
}

module.exports = WalletService;
