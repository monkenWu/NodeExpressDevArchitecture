const { Sequelize } = require('sequelize');
const config = require('../config/config');

class DbConnection {
    
    static engine = null;

    /**
     * 取得資料庫連線實體
     * 
     * @returns {Sequelize}
     * @returns 
     */
    static getEngine() {
        if (this.engine instanceof Sequelize) {
            return this.engine;
        }
        let dbData = config[process.env.NODE_ENV];
        console.log(`Database Driver: ${dbData.dialect} Storage: ${dbData.storage}`);
        const sequelize = new Sequelize({
            dialect: dbData.dialect,
            storage: dbData.storage
        });
        this.engine = sequelize;
        return this.engine;
    }

    /**
     * 關閉資料庫連線
     * 
     * @returns 
     */
    static async closeConnection() {
        if (this.engine == null) {
            return ;
        }
        await this.engine.close();
        this.engine = null;
        console.log('Database connection is closed.');
    }
}

module.exports = DbConnection;
