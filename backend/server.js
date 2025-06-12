const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/database'); // Подключение к MongoDB


const productRoutes = require('./routes/productRoutes');
const newsRoutes = require('./routes/newsRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require("./routes/authRoutes");
const couponRoutes = require('./routes/couponRoutes');
const flavorRoutes = require('./routes/flavorRoutes');
const packagingRoutes = require('./routes/packagingRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const app = express();

app.use(cors({
    origin:  ['http://26.112.27.74:5173', 'http://localhost:5173'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());



// Маршруты
app.use('/api/flavors', flavorRoutes);
app.use('/api/packagings', packagingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/news', newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use("/api/comparison", comparisonRoutes);
app.use("/api/payments", paymentRoutes);


// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT,'26.112.27.74', async () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    await connectDB(); // Подключаемся к MongoDB
});
