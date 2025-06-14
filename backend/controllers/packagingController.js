const { Packaging} = require('../models');
exports.getPackagings = async (req, res) => {
    try {
      const packagings = await Packaging.find().populate('productId');
      if (packagings.length === 0) {
        return res.status(404).json({ error: 'Packages not found' });
      }
      res.json(packagings);
    } catch (error) {
      res.status(500).json({ error: 'Error receiving packages' });
    }
  };
  
  // Получить упаковку по ID
  exports.getPackagingById = async (req, res) => {
    try {
      const packaging = await Packaging.findById(req.params.id).populate('productId');
      if (!packaging) {
        return res.status(404).json({ error: 'Packaging not found' });
      }
      res.json(packaging);
    } catch (error) {
      res.status(500).json({ error: 'Package retrieval error' });
    }
  };
  
  // Получить упаковки для конкретного продукта
  exports.getPackagingByProduct = async (req, res) => {
    try {
      const packagings = await Packaging.find({ productId: req.params.productId }).sort({ weight: 'ascending' });
      if (packagings.length === 0) {
        return res.status(404).json({ error: 'No packaging found for this product' });
      }
      res.json(packagings);
    } catch (error) {
      res.status(500).json({ error: 'Error receiving packages for the product' });
    }
  };
  
  // Добавить новую упаковку
  exports.createPackaging = async (req, res) => {
    try {
      const { productId, size, price } = req.body; // Пример полей для упаковки
      const newPackaging = new Packaging({ productId, size, price });
      await newPackaging.save();
      res.status(201).json(newPackaging);
    } catch (error) {
      res.status(500).json({ error: 'Package creation error' });
    }
  };
  
  // Обновить упаковку
  exports.updatePackaging = async (req, res) => {
    try {
      const packaging = await Packaging.findById(req.params.id);
      if (!packaging) {
        return res.status(404).json({ error: 'Packaging not found' });
      }
      const { productId, size, price } = req.body;
      packaging.productId = productId || packaging.productId;
      packaging.size = size || packaging.size;
      packaging.price = price || packaging.price;
      await packaging.save();
      res.json(packaging);
    } catch (error) {
      res.status(500).json({ error: 'Package update error' });
    }
  };
  
  // Удалить упаковку
  exports.deletePackaging = async (req, res) => {
    try {
      const packaging = await Packaging.findById(req.params.id);
      if (!packaging) {
        return res.status(404).json({ error: 'Packaging not found' });
      }
      await packaging.remove();
      res.json({ message: 'Packaging removed' });
    } catch (error) {
      res.status(500).json({ error: 'Package removal error' });
    }
  };
// Получить новинки
exports.getNewArrivals = async (req, res) => {
  try {
      const products = await Packaging.find()
          .sort({ createdAt: -1 })
      res.json(products);
  } catch (err) {
      res.status(500).json({ error: 'Error receiving new items' });
  }
};

// Получить рекомендации
exports.getRecommendations = async (req, res) => {
  try {
      const packaging = await Packaging.find()
          .sort({ createdAt: 0 }) // Сортировка по возрастанию даты
      res.json(packaging);
  } catch (err) {
      res.status(500).json({ error: 'Error receiving recommendations' });
  }
};

// Поиск продуктов по параметрам
exports.getSearchProductsByParams = async (req, res) => {
  try {
      const { brand, category, priceMin, priceMax, sortField, sortOrder, limit, page } = req.query;

      const limitNumber = parseInt(limit, 10) || 10;
      const pageNumber = parseInt(page, 10) || 1;
      const totalLimit = limitNumber * pageNumber;

      const query = {};
      
      if (priceMin || priceMax) {
        query.price = {};
        if (priceMin) query.price.$gte = parseFloat(priceMin);
        if (priceMax) query.price.$lte = parseFloat(priceMax);
      }

      let products = await Packaging.find(query)
      .populate("productId")
      .sort({ [sortField || "createdAt"]: sortOrder === "desc" ? -1 : 1 });

      // Фильтрация по brand и category после получения данных
      if (brand) {
        const brandArray = Array.isArray(brand) ? brand : [brand];
        products = products.filter(p => brandArray.some(b => p.productId?.brand?.includes(b)));
      }
      if (category) {
        products = products.filter(p => p.productId?.category?.includes(category));
      }
      const totalProductsCount = products.length;
      products = products.slice(0, totalLimit);
      const hasMore = totalProductsCount > totalLimit;

      res.json({ products, hasMore });
  } catch (err) {
      console.error('Product filtering error:', err);
      res.status(500).json({ error: 'Product filtering error' });
  }
};

exports.getAllSearchProducts = async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'The query parameter is required.' });
    }

    try {
      
        const packagings = await Packaging.find()
            .populate({
                path: 'productId',
                match: { productName: { $regex: query, $options: 'i' } },
                select: 'productName _id brand category',
            });

        const filteredPackagings = packagings.filter(p => p.productId);

        res.json(filteredPackagings);
    } catch (error) {
        console.error('Error searching for packages:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
