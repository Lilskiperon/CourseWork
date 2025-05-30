const { Flavor } = require('../models'); 

// Получить все вкусы для продукта
exports.getAllFlavors = async (req, res) => {
    try {
        const flavors = await Flavor.find();
        res.json(flavors);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения вкусов' });
    }
};

// Получить вкусы для определенного продукта по ID упаковки
exports.getFlavorsByPackagingId = async (req, res) => {
    try {
        const { packagingId } = req.params;
        const flavors = await Flavor.find({ packagingId: packagingId });
        if (!flavors.length) {
            return res.status(404).json({ error: 'Вкусы не найдены для этого пакета' });
        }
        res.json(flavors);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения вкусов' });
    }
};
exports.getFlavorsById = async (req, res) => {
    try {
        const { flavorId } = req.params;
        const product = await Flavor.findOne({ _id: flavorId }).populate("packagingId").populate({
            path: "packagingId",
            populate: { path: "productId" }
        });
		
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения продукта' });
    }
};

// Добавить новый вкус
exports.createFlavor = async (req, res) => {
    try {
        const { packagingId, flavorName, stockQuantity } = req.body;
        const flavor = new Flavor({
            packagingId,
            flavorName,
            stockQuantity,
            lastUpdated: new Date(),
        });
        await flavor.save();  // Сохраняем новый документ в MongoDB
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

        const flavor = await Flavor.findById(id);  // Поиск документа по id
        if (!flavor) {
            return res.status(404).json({ error: 'Вкус не найден' });
        }
        flavor.flavorName = flavorName;
        flavor.stockQuantity = stockQuantity;
        flavor.lastUpdated = new Date();

        await flavor.save();  // Сохраняем изменения
        res.json(flavor);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления вкуса' });
    }
};

// Удалить вкус
exports.deleteFlavor = async (req, res) => {
    try {
        const { id } = req.params;
        const flavor = await Flavor.findById(id);  // Поиск по id
        if (!flavor) {
            return res.status(404).json({ error: 'Вкус не найден' });
        }
        await flavor.remove();  // Удаляем документ
        res.json({ message: 'Вкус удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления вкуса' });
    }
};
exports.getProductsByIds = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: "Неверный формат данных" });
        }
        const productMap = new Map(products.map(item => [item.product, { quantity: item.quantity, price: item.price }]));

        const productIds = [...productMap.keys()];

        const foundProducts = await Flavor.find({ _id: { $in: productIds } }).populate("packagingId").populate({
            path: "packagingId",
            populate: { path: "productId" }
        });

        const result = foundProducts.map(product => ({
            ...product.toObject(),
            quantity: productMap.get(product._id.toString())?.quantity || 0,
            price: productMap.get(product._id.toString())?.price || 0
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Ошибка получения продуктов" });
    }
};