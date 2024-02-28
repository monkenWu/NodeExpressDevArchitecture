const path = require('path');

let dbDriver = process.env.DB_DRIVER;
let storage = process.env.DB_PATH;
if (!storage && !dbDriver) {
  const envPath = require('path').join(__dirname, '../.env');
  require('dotenv').config({ path: envPath});
  dbDriver = process.env.DB_DRIVER;
  storage = process.env.DB_PATH;
}
//判斷 envPath 是否為絕對路徑，若不是則將其轉換為絕對路徑（以 Project Root 為基準）
if (storage && !path.isAbsolute(storage)) {
    storage = path.join(__dirname, '../', storage);
}

module.exports = {
  development: {
    dialect: dbDriver,
    storage: storage
  },
  test: {
    dialect: dbDriver,
    storage: storage
  },
  production: {
    dialect: dbDriver,
    storage: storage
  }
};
