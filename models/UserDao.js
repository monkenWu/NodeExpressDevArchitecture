class UserDao {

    constructor() {
        this.user = require('./orm').User;
    }

    /**
     * 建立使用者
     * 
     * @param {string} username 
     * @param {string} hashedPassword 
     * @returns 
     */
    async createUser(username, hashedPassword) {
        try {
            const user = await this.user.create({
                username,
                password: hashedPassword,
            });
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * 透過使用者名稱尋找使用者
     * 
     * @param {string} username 
     * @returns 
     */
    async findByUsername(username) {
        try {
            const user = await this.user.findOne({
                where: { username },
            });
            return user;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    /**
     * 透過使用者ID尋找使用者
     * 
     * @param {number} id
     */
    async findById(id) {
        try {
            const user = await User.findByPk(id);
            return user;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }
}

module.exports = UserDao;