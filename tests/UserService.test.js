const e = require('express');
const UserService = require('../services/UserService');
const ValidationError = require('../system/exceptions/ValidationError');
const {umzug, DbConnection} = require('../system/test/BaseTest');

let userService = new UserService();

beforeAll(async () => {
    await umzug.up();
});

afterAll(async () => {
    await umzug.down({to: 0});
    await DbConnection.closeConnection();
});

describe('UserService with actual database', () => {

    const baseUserNanme = 'testuser';
    const basePassword = 'password123';

    test('should create a user', async () => {
        await userService.register(baseUserNanme, basePassword);
        const user = await userService.getUserInfo(baseUserNanme);

        expect(user).toBeTruthy();
        expect(user.username).toBe(baseUserNanme);
        expect(user.password).not.toBe(basePassword);
        expect(user.wallet).toBeTruthy();
        expect(user.wallet.balance).toBe(0);
    });

    test('should not create a user with the same username', async () => {
        try {
            await userService.register(baseUserNanme, basePassword);
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('User already exists');
        }
    });

    test('should login a user', async () => {
        const token = await userService.login(baseUserNanme, basePassword);
        expect(token).hasOwnProperty('accessToken');
        
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token.accessToken, process.env.JWT_SECRET);
        expect(decoded).hasOwnProperty('id');
        expect(decoded).hasOwnProperty('username');
        expect(decoded.username).toBe(baseUserNanme);
    });

    test('should not login a user with invalid password', async () => {
        try {
            await userService.login(baseUserNanme, 'invalidpassword');
        } catch (error) {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe('Invalid username or password');
        }
    });

    test('should get user info', async () => {
        const user = await userService.getUserInfo(baseUserNanme);
        expect(user).toBeTruthy();
        expect(user.username).toBe(baseUserNanme);
    });
});
