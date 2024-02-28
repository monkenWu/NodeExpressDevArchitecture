const {umzug, DbConnection} = require('./Migration');

module.exports = async () => {
    await umzug.down({to: 0});
    console.log('Global teardown: Database rollbacked');
};
