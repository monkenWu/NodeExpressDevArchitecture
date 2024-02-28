const WalletService = require('../../services/WalletService');
const UserService = require('../../services/UserService');
const ValidationError = require('../../system/exceptions/ValidationError');

class WalletController {
    constructor() {
        this.walletService = new WalletService();
        this.userService = new UserService();
        this.getInfo = this.getInfo.bind(this);
        this.deposit = this.deposit.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.transfer = this.transfer.bind(this);
    }

    /**
     * 取得使用者錢包詳細資訊
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async getInfo(req, res) {
        const userId = req.auth.id;
        const info = await this.walletService.getWalletInfo(userId);
        return res.json(info);
    }

    /**
     * 使用者存款
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @returns 
     */
    async deposit(req, res) {
        const userId = req.auth.id;
        const { amount } = req.body;
        if (!amount) {
            throw new ValidationError('Amount is required');
        }
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }
        await this.walletService.deposit(userId, amount);
        return res.status(204).send();
    }

    /**
     * 使用者提款
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @returns 
     */
    async withdraw(req, res) {
        const userId = req.auth.id;
        const { amount } = req.body;
        if (!amount) {
            throw new ValidationError('Amount is required');
        }
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }

        await this.walletService.withdraw(userId, amount);
        return res.status(204).send();
    }

    /**
     * 使用者轉帳
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @returns 
     */
    async transfer(req, res) {
        const userId = req.auth.id;
        const { targetUserName, amount } = req.body;
        if (!targetUserName || !amount) {
            throw new ValidationError('targetUserName and amount are required');
        }
        if (amount <= 0) {
            throw new ValidationError('Amount must be greater than 0');
        }

        const targetUser = await this.userService.getUserInfo(targetUserName);
        if (!targetUser) {
            throw new ValidationError('Target user not found');
        }

        await this.walletService.transfer(userId, targetUser.id, amount);
        return res.status(204).send();
    }
}

module.exports = new WalletController();
