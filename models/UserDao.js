class UserDao {

    constructor() {
        this.user = require('./orm').User;
        this.wallet = require('./orm').Wallet;
    }

    /**
     * 建立使用者
     * 
     * @param {string} username 
     * @param {string} hashedPassword 
     * @returns 
     */
    async createUser(username, hashedPassword) {
        const transaction = await this.user.sequelize.transaction();
        try {
            const user = await this.user.create({
                username,
                password: hashedPassword,
            }, { transaction });

            await this.wallet.create({
                user_id: user.id,
                balance: 0
            }, { transaction });

            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            
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
                include: {
                    model: this.wallet,
                    as: 'wallet',
                }
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
            const user = await User.findByPk({
                where: { id },
                include: {
                    model: Wallet,
                    as: 'wallet',
                }
            });
            return user;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }
}

module.exports = UserDao;