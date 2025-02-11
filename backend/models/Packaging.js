const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Подключение к БД
const Product = require('./Product'); // Подключаем модель продукта

const Packaging = sequelize.define('Packaging', {
    packagingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'productId'
        }
    },
    productImageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'packaging',
    timestamps: false
});

module.exports = Packaging;
