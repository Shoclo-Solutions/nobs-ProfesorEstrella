const Sequelize = require("sequelize");
const sequelizeInstance = require("../utils/database");

const Course = sequelizeInstance.define("course", {
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
  alt_names: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Course;
