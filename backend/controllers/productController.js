const { Sequelize,Packaging, Product} = require('../models');

// Получить все продукты
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Packaging,
                as: 'packagingOptions' 
            }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения продуктов' });
    }
};
// Получить продукт по ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
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
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка создания продукта' });
    }
};

// Обновить продукт
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }
        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления продукта' });
    }
};

// Удалить продукт
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }
        await product.destroy();
        res.json({ message: 'Продукт удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления продукта' });
    }
};
// Получить новинки 
exports.getNewArrivals = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt', 'DESC']], // Сортировка по дате добавления
            include: {
                model: Packaging,
                as: 'packagingOptions' 
            }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения новинок' });
    }
};

// Получить рекомендации
exports.getRecommendations = async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [['createdAt']], // Сортировка по рейтингу
            include: {
                model: Packaging,
                as: 'packagingOptions' 
            }
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения рекомендаций' });
    }
};

// Search product by name
exports.getSearchProductsByParams = async (req, res) => {
    try {
        const { brand, category, priceMin, priceMax, sortField, sortOrder, limit, page } = req.query;

        const limitNumber = parseInt(limit, 10) || 10; // Количество товаров на странице
        const pageNumber = parseInt(page, 10) || 1; // Номер страницы
        const offset = (pageNumber - 1) * limitNumber; // Сколько товаров пропустить

        const where = {};
        if (brand) where.brand = brand;
        if (category) where.category = category;
        if (priceMin) where.price = { [Sequelize.Op.gte]: priceMin };
        if (priceMax) where.price = { [Sequelize.Op.lte]: priceMax };

        const products = await Product.findAll({
            where,
            order: sortField ? [[sortField, sortOrder === 'desc' ? 'DESC' : 'ASC']] : undefined,
            limit: limitNumber,
            offset,
            
        });

        const totalProductsCount = await Product.count({ where });

        const hasMore = offset + products.length < totalProductsCount;

        res.json({
            products,
            hasMore,
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Ошибка фильтрации продуктов' });
    }
};

exports.getBrandProducts = async (req, res) => {
    try {
        const brands = await Product.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']],
        });
        res.json(brands);
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).send('Server error');
    }
};

exports.getAllProductsById = async (req, res) => {
    const { ids } = req.query;
    try {
        // Ensure ids is provided and is an array
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ error: 'Некорректный список ID' });
        }
        const where = {
            ProductId: ids  
        };

        const products = await Product.findAll({
            where,
            include: {
                model: Packaging,
                as: 'packagingOptions' 
            }
            
        });

        // Return the fetched products
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения избранных товаров' });
    }
}

exports.getAllSearchProducts = async (req, res) => {
    const { query } = req.query;
  
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Параметр query обязателен' });
    }
  
    try {
      const products = await Product.findAll({
        where: {
          productName: {
            [Sequelize.Op.like]: `%${query}%`, 
          },
        },
        attributes: ['productId', 'productName', 'productImageUrl', 'price'], 
      });
  
      res.json(products);
    } catch (error) {
      console.error('Ошибка при поиске продуктов:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  };