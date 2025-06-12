const { Order, User } = require('../models');

// Отримати всі замовлення
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error receiving orders', error });
    }
};
exports.getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate('products.product');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error receiving user orders', error });
    }
};

// Отримати замовлення за ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id, { include: User });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error receiving order', error });
    }
};

// Створити нове замовлення
exports.createOrder = async (req, res) => {
    try {
        const newOrder = await Order.create(req.body);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error });
    }
};

// Оновити замовлення
exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedRows] = await Order.update(req.body, { where: { order_Id: id } });
        if (!updatedRows) return res.status(404).json({ message: 'No orders found for update' });
        res.status(200).json({ message: 'Order successfully updated' });
    } catch (error) {
        res.status(400).json({ message: 'Order update error', error });
    }
};

// Видалити замовлення
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Order.destroy({ where: { order_Id: id } });
        if (!deletedRows) return res.status(404).json({ message: 'No orders found to delete' });
        res.status(200).json({ message: 'Order successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Order deletion error', error });
    }
};


