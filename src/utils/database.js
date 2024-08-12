require('dotenv/config');
const Sequelize = require('sequelize');

/** @type {import('sequelize').Sequelize} */
const sequelizeInstance = new Sequelize(
	'database',
	process.env.DB_USER,
	process.env.DB_PASS,
	{
		dialect: 'sqlite',
		host: 'localhost',
		storage: './database.sqlite',
		logging: console.log,
	}
);

module.exports = sequelizeInstance;
