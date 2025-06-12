const {  User } = require('../models');

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'User login error', error });
    }
};

// Створити нового користувача
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'User creation error', error });
    }
};

// Оновити користувача
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await User.update(req.body, { where: { user_Id: id } });
        if (!updatedRows) return res.status(404).json({ message: 'No user found for update' });
        res.status(200).json({ message: 'User successfully updated' });
    } catch (error) {
        res.status(400).json({ message: 'User update error', error });
    }
};

// Видалити користувача
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await User.destroy({ where: { user_Id: id } });
        if (!deletedRows) return res.status(404).json({ message: 'User not found for deletion' });
        res.status(200).json({ message: 'User successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'User deletion error', error });
    }
};