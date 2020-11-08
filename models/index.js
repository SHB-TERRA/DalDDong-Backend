'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Promise = require('./promise')(sequelize, Sequelize);
db.Participant = require('./participant')(sequelize, Sequelize);

/* user -> promise: 1 -> N */
db.User.hasMany(db.Promise, { foreignKey: 'user_id', sourceKey: 'user_id'});
db.Promise.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id'});

/* promise -> participant: 1 -> N */
db.Promise.hasMany(db.Participant, { foreignKey: 'promise_id', sourceKey: 'id'});
db.Participant.belongsTo(db.Promise, { foreignKey: 'promise_id', targetKey: 'id'});

/* user -> participant: 1 -> N */
db.User.hasMany(db.Participant, { foreignKey: 'user_id', sourceKey: 'user_id'});
db.Participant.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'user_id'});

module.exports = db;
