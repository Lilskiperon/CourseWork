const { Product } = require('../models');

// Получить все продукты
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения продуктов' });
    }
};

// Получить продукт по ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения продукта' });
    }
};

// Добавить продукт
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка создания продукта' });
    }
};

// Обновить продукт
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления продукта' });
    }
};

// Удалить продукт
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }
        res.json({ message: 'Продукт удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления продукта' });
    }
};


// Получить бренды
exports.getBrandProducts = async (req, res) => {
    try {
        const brands = await Product.distinct('brand');
        res.json(brands);
    } catch (error) {
        console.error('Ошибка получения брендов:', error);
        res.status(500).send('Server error');
    }
};
