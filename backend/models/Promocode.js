const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const PromoCode = sequelize.define('PromoCode', {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discountPercent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },
    freeShipping: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    maxUses: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usesLeft: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'promoCode',
    timestamps: false, 
});

  module.exports = PromoCode;
