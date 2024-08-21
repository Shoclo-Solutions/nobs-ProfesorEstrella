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
    courses: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    rating: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    paranoid: true,
    tableName: 'comments',
  }
);

module.exports = Comment;
