const Sequelize = require('sequelize');
const sequelizeInstance = require('../utils/database');

const Comment = sequelizeInstance.define(
  'comment',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    by: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Comment;
