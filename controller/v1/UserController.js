const UserService = require('../../services/UserService');
const ValidationError = require('../../system/exceptions/ValidationError');

class UserController {

    constructor() {
        this.userService = new UserService();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);
    }

    /**
     * 使用者註冊
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async register(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ValidationError("The 'username' or 'password' not found");
        }
        const user = await this.userService.register(username, password);
        return res.status(201).json({ msg: "User created", user: { username: user.username } });
    }

    /**
     * 使用者登入
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ValidationError("The 'username' or 'password' not found");
        }
        const accessToken = await this.userService.login(username, password);
        return res.json({ accessToken });
    }

    /**
     * 取得使用者資訊
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
    async getUserInfo(req, res) {
        return res.json(req.auth);
    }
}

module.exports = new UserController();
