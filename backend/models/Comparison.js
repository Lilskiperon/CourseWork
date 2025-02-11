const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comparison = sequelize.define('Comparison', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    addedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'comparison',
    timestamps: false,
});

module.exports = Comparison;
