const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const sequelize = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const newsRoutes = require('./routes/newsRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require("./routes/authRoutes");
const promoCodeRoutes = require('./routes/promoCodeRoutes');
const flavorRoutes = require('./routes/flavorRoutes');
const packagingRoutes = require('./routes/packagingRoutes');


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.options('*', cors());

// Маршруты
app.use('/api/flavors', flavorRoutes);
app.use('/api/packagings', packagingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/news', newsRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/promo-codes', promoCodeRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Подключение к базе данных успешно');
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
    }
});
