const { Flavor } = require('../models'); 

// Получить все вкусы для продукта
exports.getAllFlavors = async (req, res) => {
    try {
        const flavors = await Flavor.find();
        res.json(flavors);
    } catch (err) {
        res.status(500).json({ error: 'Error receiving flavors' });
    }
};

// Получить вкусы для определенного продукта по ID упаковки
exports.getFlavorsByPackagingId = async (req, res) => {
    try {
        const { packagingId } = req.params;
        const flavors = await Flavor.find({ packagingId: packagingId });
        if (!flavors.length) {
            return res.status(404).json({ error: 'No flavors found for this package' });
        }
        res.json(flavors);
    } catch (err) {
        res.status(500).json({ error: 'Error receiving flavors' });
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
        res.status(500).json({ error: 'Product retrieval error' });
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
        res.status(500).json({ error: 'Error adding new flavor' });
    }
};

// Обновить вкус
exports.updateFlavor = async (req, res) => {
    try {
        const { id } = req.params;
        const { flavorName, stockQuantity } = req.body;

        const flavor = await Flavor.findById(id);  // Поиск документа по id
        if (!flavor) {
            return res.status(404).json({ error: 'Taste not found' });
        }
        flavor.flavorName = flavorName;
        flavor.stockQuantity = stockQuantity;
        flavor.lastUpdated = new Date();

        await flavor.save();  // Сохраняем изменения
        res.json(flavor);
    } catch (err) {
        res.status(500).json({ error: 'Flavor update error' });
    }
};

// Удалить вкус
exports.deleteFlavor = async (req, res) => {
    try {
        const { id } = req.params;
        const flavor = await Flavor.findById(id);  // Поиск по id
        if (!flavor) {
            return res.status(404).json({ error: 'Taste not found' });
        }
        await flavor.remove();  // Удаляем документ
        res.json({ message: 'Taste removed' });
    } catch (err) {
        res.status(500).json({ error: 'Taste removal error' });
    }
};
exports.getProductsByIds = async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ error: "Incorrect data format" });
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
        res.status(500).json({ error: "Error receiving products" });
    }
};