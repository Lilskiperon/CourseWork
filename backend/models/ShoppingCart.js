const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShoppingCart = sequelize.define('ShoppingCart', {
    shoppingCartId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
  
},{
    tableName: 'shoppingCart',
    timestamps: false,
});

module.exports = ShoppingCart;