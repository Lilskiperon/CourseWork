const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User, ShoppingCart } = require("../models");
require('dotenv').config();
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Проверка, существует ли уже пользователь с таким email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email уже зарегистрирован!" });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const shoppingCart = await ShoppingCart.create();
        if (!shoppingCart || !shoppingCart.shoppingCartId) {
            return res.status(500).json({ error: "Ошибка создания корзины." });
        }

        console.log("Shopping cart created with ID:", shoppingCart.shoppingCartId);
        // Создание пользователя
        const newUser = await User.create({
            email,
            shoppingCartId: shoppingCart.shoppingCartId,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
        });

        res.status(201).json({ message: "Регистрация успешна!", user: { id: newUser.id, email: newUser.email } });
    } catch (error) {
        console.error("Ошибка регистрации пользователя:", error);
        res.status(500).json({ error: "Ошибка сервера. Попробуйте снова." });
    }
};

exports.login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    console.log('Полученные данные:', { email, password, rememberMe });
    if (!email || !password) {
        return res.status(400).json({ message: 'Email и пароль обязательны' });
    }
    try {
      // Проверяем, есть ли пользователь
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: 'Пользователь не найден' });
  
      // Проверяем пароль
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) return res.status(400).json({ message: 'Неверный пароль' });
  
      // Создаем токен
      const payload = { userId: user.userId, email: user.email };
      const tokenOptions = rememberMe ? { expiresIn: '7d' } : { expiresIn: '1h' }; 
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, tokenOptions);
  
      // Возвращаем токен
      res.cookie('authToken', token, { httpOnly: true, secure: false, sameSite: 'Strict', sameSite: 'Lax' });
      res.json({ message: 'Успешный вход', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
};
exports.logoutUser = (req, res) => {
    try {
        res.clearCookie('authToken', { httpOnly: true, sameSite: 'Lax' }); // Удаляем cookie
        return res.json({ message: 'Вы успешно вышли из системы' });
    } catch (error) {
        return res.status(500).json({ message: 'Ошибка при выходе', error });
    }
};

exports.me = async (req, res) => {
    let token = req.cookies.authToken; // Извлекаем токен из кук
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            where: { userId: decoded.userId },
            attributes: ['userId', 'email', 'firstName', 'lastName', 'phone']
        });
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        res.json(user);
    } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        res.status(401).json({ message: 'Недействительный токен' });
    }
};