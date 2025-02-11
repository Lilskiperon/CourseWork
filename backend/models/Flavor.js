const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Packaging = require('./Packaging');

const Flavor = sequelize.define('Flavor', {
    flavorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    packagingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Packaging,
            key: 'packagingId'
        }
    },
    flavorName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'flavor',
    timestamps: false,
});

module.exports = Flavor;
