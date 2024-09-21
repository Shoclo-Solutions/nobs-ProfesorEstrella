const Sequelize = require('sequelize');
const sequelizeInstance = require('../utils/database');

const BannedTable = sequelizeInstance.define(
    'banned',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        discordId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'banned',
    }
);

module.exports = BannedTable;