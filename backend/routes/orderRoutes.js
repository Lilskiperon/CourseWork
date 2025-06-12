const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);              // Отримати всі замовлення
router.get('/user/:userId', orderController.getOrdersByUser); // Отримати замовлення користувача за ID
router.get('/:id', orderController.getOrderById);           // Отримати замовлення за ID
router.post('/', orderController.createOrder);              // Створити нове замовлення
router.put('/:id', orderController.updateOrder);            // Оновити замовлення
router.delete('/:id', orderController.deleteOrder);         // Видалити замовлення

module.exports = router;
