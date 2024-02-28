const {umzug, DbConnection} = require('./Migration');

module.exports = async () => {
    await umzug.up();
    console.log('Global setup: Database migrated');
};
