const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserDao = require('../models/UserDao');
const ValidationError = require('../system/exceptions/ValidationError');

class UserService {

    constructor() {
        this.userDao = new UserDao();
    }

    async register(username, password) {
        const existingUser = await this.userDao.findByUsername(username);
        if (existingUser) {
            throw new ValidationError('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userDao.createUser(username, hashedPassword);
        return user;
    }

    async login(username, password) {
        const user = await this.userDao.findByUsername(username);

        if (user && await bcrypt.compare(password, user.password)) {
            const accessTokenExpires = process.env.JWT_ACCESS_TOKEN_EXPIRES || 3600;
            const accessToken = jwt.sign({
                id: user.id,
                username: user.username
            }, process.env.JWT_SECRET, { expiresIn: parseInt(accessTokenExpires) });

            return { accessToken };
        }
        throw new ValidationError('Invalid username or password');
    }

    async getUserInfo(username) {
        const user = await this.userDao.findByUsername(username);
        if (user) {
            return {
                id: user.id,
                username: user.username,
                wallet: {
                    balance: user.wallet.balance
                }
            };
        }
        return null;
    }
}

module.exports = UserService;
