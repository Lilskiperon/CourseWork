const { Packaging } = require('../models');

// Получить упаковку по ID
exports.getPackagingById = async (req, res) => {
    try {
        const packaging = await Packaging.findByPk(req.params.id);
        if (!packaging) {
            return res.status(404).json({ error: 'Упаковка не найдена' });
        }
        res.json(packaging);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения упаковки' });
    }
};

// Получить упаковки для конкретного продукта
exports.getPackagingByProduct = async (req, res) => {
    try {
        const packaging = await Packaging.findAll({
            where: { productId: req.params.productId }
        });
        res.json(packaging);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения упаковок для продукта' });
    }
};

// Добавить новую упаковку
exports.createPackaging = async (req, res) => {
    try {
        const packaging = await Packaging.create(req.body);
        res.status(201).json(packaging);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка создания упаковки' });
    }
};

// Обновить упаковку
exports.updatePackaging = async (req, res) => {
    try {
        const packaging = await Packaging.findByPk(req.params.id);
        if (!packaging) {
            return res.status(404).json({ error: 'Упаковка не найдена' });
        }
        await packaging.update(req.body);
        res.json(packaging);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления упаковки' });
    }
};

// Удалить упаковку
exports.deletePackaging = async (req, res) => {
    try {
        const packaging = await Packaging.findByPk(req.params.id);
        if (!packaging) {
            return res.status(404).json({ error: 'Упаковка не найдена' });
        }
        await packaging.destroy();
        res.json({ message: 'Упаковка удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления упаковки' });
    }
};
