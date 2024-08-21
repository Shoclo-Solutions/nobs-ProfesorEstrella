require('dotenv/config');
const Sequelize = require('sequelize');

/** @type {import('sequelize').Sequelize} */
const sequelizeInstance = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'sqlite',
    host: 'localhost',
    storage: './' + process.env.DB_NAME + '.sqlite',
    logging: console.log,
  }
);

module.exports = sequelizeInstance;
