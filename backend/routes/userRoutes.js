const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.getUserById);             // Отримати користувача за ID
router.post('/', userController.createUser);                // Створити нового користувача
                                                              // Оновити користувача
router.delete('/:id', userController.deleteUser);           // Видалити користувача

module.exports = router;
