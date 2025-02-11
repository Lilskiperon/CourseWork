const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ваше подключение к базе данных

const News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
  },
  author: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'news',
  timestamps: false, // Если таблица не содержит createdAt и updatedAt
});

module.exports = News;
