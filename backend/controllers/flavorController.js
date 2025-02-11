const { Flavor } = require('../models');

// Получить все вкусы для продукта
exports.getAllFlavors = async (req, res) => {
    try {
        const flavors = await Flavor.findAll();
        res.json(flavors);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения вкусов' });
    }
};

// Получить вкусы для определенного продукта по ID упаковки
exports.getFlavorsByPackagingId = async (req, res) => {
    try {
        const { packagingId } = req.params;
        const flavors = await Flavor.findAll({
            where: {
                packagingId: packagingId,
            },
        });
        if (!flavors.length) {
            return res.status(404).json({ error: 'Вкусы не найдены для этого пакета' });
        }
        res.json(flavors);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения вкусов' });
    }
};

// Добавить новый вкус
exports.createFlavor = async (req, res) => {
    try {
        const { packagingId, flavorName, stockQuantity } = req.body;
        const flavor = await Flavor.create({
            packagingId,
            flavorName,
            stockQuantity,
            lastUpdated: new Date(),
        });
        res.status(201).json(flavor);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка добавления нового вкуса' });
    }
};

// Обновить вкус
exports.updateFlavor = async (req, res) => {
    try {
        const { id } = req.params;
        const { flavorName, stockQuantity } = req.body;
        
        const flavor = await Flavor.findByPk(id);
        if (!flavor) {
            return res.status(404).json({ error: 'Вкус не найден' });
        }
        await flavor.update({ flavorName, stockQuantity, lastUpdated: new Date() });
        res.json(flavor);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления вкуса' });
    }
};

// Удалить вкус
exports.deleteFlavor = async (req, res) => {
    try {
        const { id } = req.params;
        const flavor = await Flavor.findByPk(id);
        if (!flavor) {
            return res.status(404).json({ error: 'Вкус не найден' });
        }
        await flavor.destroy();
        res.json({ message: 'Вкус удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления вкуса' });
    }
};
