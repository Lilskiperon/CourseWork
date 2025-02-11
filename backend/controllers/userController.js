const { Sequelize, User } = require('../models');

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання користувача', error });
    }
};

// Створити нового користувача
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Помилка створення користувача', error });
    }
};

// Оновити користувача
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await User.update(req.body, { where: { user_Id: id } });
        if (!updatedRows) return res.status(404).json({ message: 'Користувача не знайдено для оновлення' });
        res.status(200).json({ message: 'Користувача успішно оновлено' });
    } catch (error) {
        res.status(400).json({ message: 'Помилка оновлення користувача', error });
    }
};

// Видалити користувача
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await User.destroy({ where: { user_Id: id } });
        if (!deletedRows) return res.status(404).json({ message: 'Користувача не знайдено для видалення' });
        res.status(200).json({ message: 'Користувача успішно видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка видалення користувача', error });
    }
};