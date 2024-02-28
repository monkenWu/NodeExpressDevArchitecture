const DbConnection = require('../DbConnection');
const {Umzug, SequelizeStorage} = require('umzug');
const Sequelize = require('sequelize').Sequelize;

const sequelize = DbConnection.getEngine();
const sequelizeContext = sequelize.getQueryInterface();
const umzug = new Umzug({
    migrations: {
        glob: require('path').join(__dirname, '../../migrations') + '/*.js' ,
        resolve: ({ name, path }) => {
            const migration = require(path)
            return {
                name,
                up: async () => migration.up(sequelizeContext, Sequelize),
                down: async () => migration.down(sequelizeContext, Sequelize),
            }
        },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: null,
});

module.exports = {
    umzug,
    sequelizeContext,
    Sequelize,
    DbConnection
}

// beforeAll(async () => {
//     await umzug.up();
// });

// afterAll(async () => {
//     await umzug.down({to: 0});
//     // await DbConnection.closeConnection();
// });
