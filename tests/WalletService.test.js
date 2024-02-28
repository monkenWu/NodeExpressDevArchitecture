const WalletService = require('../services/WalletService');
const UserService = require('../services/UserService');
const ValidationError = require('../system/exceptions/ValidationError');

describe('WalletService with actual database',() => {

    let walletService;
    let userService;

    beforeAll(async () => {
        walletService = new WalletService();
        userService = new UserService();
        await userService.register('walletUser', 'password');
        await userService.register('targetWalletUser', 'password');
    });

    test('should deposit to a wallet', async () => {
        const walletUser = await userService.getUserInfo('walletUser');
        const depositAmount = 100;
        await walletService.deposit(walletUser.id, depositAmount);

        const wallet = await walletService.getWalletInfo(walletUser.id);
        expect(wallet).toBeTruthy();
        expect(wallet.balance).toBe(depositAmount);
    });

    test('should withdraw from a wallet', async () => {
        const walletUser = await userService.getUserInfo('walletUser');
        const userId = walletUser.id;
        const withdrawAmount = 50;
        await walletService.withdraw(userId, withdrawAmount);

        const wallet = await walletService.getWalletInfo(userId);
        expect(wallet).toBeTruthy();
        expect(wallet.balance).toBe(50);
    });

    test('should transfer from one wallet to another', async () => {
        const walletUser = await userService.getUserInfo('walletUser');
        const userId = walletUser.id;

        const targetWalletUser = await userService.getUserInfo('targetWalletUser');
        const targetUserId = targetWalletUser.id;

        const transferAmount = 25;
        await walletService.transfer(userId, targetUserId, transferAmount);

        const wallet = await walletService.getWalletInfo(userId);
        const targetWallet = await walletService.getWalletInfo(targetUserId);
        expect(wallet).toBeTruthy();
        expect(targetWallet).toBeTruthy();
        expect(wallet.balance).toBe(25);
        expect(targetWallet.balance).toBe(transferAmount);
    });

    test('should not withdraw due to insufficient balance', async () => {
        const walletUser = await userService.getUserInfo('walletUser');
        const userId = walletUser.id;
        try {
            await walletService.withdraw(userId, 100);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Insufficient balance');
        }
    });

    test('should not transfer due to insufficient balance', async () => {
        const walletUser = await userService.getUserInfo('walletUser');
        const userId = walletUser.id;

        const targetWalletUser = await userService.getUserInfo('targetWalletUser');
        const targetUserId = targetWalletUser.id;

        try {
            await walletService.transfer(userId, targetUserId, 100);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Insufficient balance');
        }
    });

});
