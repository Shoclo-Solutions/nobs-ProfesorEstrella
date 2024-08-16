const Sequelize = require('sequelize');
const sequelizeInstance = require('../utils/database');

const Professor = sequelizeInstance.define(
  'professor',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    fullname: {
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
      type: Sequelize.FLOAT(2, 2),
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
    tableName: 'professors',
  }
);

module.exports = Professor;
