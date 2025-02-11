const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, 
});
sequelize.sync({ alter: false }) // Используйте alter: false, чтобы избежать изменений в таблицах
    .then(() => console.log('База данных синхронизирована'))
    .catch((err) => console.error('Ошибка синхронизации базы данных:', err));
    
module.exports = sequelize;
