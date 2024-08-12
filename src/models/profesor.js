const Sequelize = require('sequelize');
const sequelizeInstance = require('../utils/database');

const Professor = sequelizeInstance.define('professor', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	last_name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	contract: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	averageRating: {
		type: Sequelize.DECIMAL(2, 1),
		allowNull: true,
		defaultValue: 0,
	},
});

module.exports = Professor;
