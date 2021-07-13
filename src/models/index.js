const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../configs/config.js');
const logger = require('../configs/logger');

const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
  host: config.database.options.host,
  port: config.database.options.port,
  dialect: config.database.options.dialect,
  logging: config.database.options.logging,
});

sequelize
  .authenticate()
  .then(() => {
    logger.info(`Connected to ${config.database.options.dialect}`);
  })
  .catch((err) => {
    logger.error('Unable to connect to the database:', err);
  });

// sequelize.sync({ force: false }).then(() => {
//   console.log('Drop and Resync with { force: false }');
// });

// sequelize.sync({ logging: console.log });

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-9) === '.model.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// relationships for models

//= ==============================
// Define all relationships here below
//= ==============================
// db.User.hasMany(db.Address);
// db.Address.belongsTo(db.User);

module.exports = db;
