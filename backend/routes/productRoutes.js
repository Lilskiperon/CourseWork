const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/user-products', productController.getAllProductsById)
router.get('/new-arrivals', productController.getNewArrivals); // Новинки
router.get('/recommendations', productController.getRecommendations); // Рекомендации
router.get('/filter-products', productController.getSearchProductsByParams); // Поиск
router.get('/brands', productController.getBrandProducts);
router.get('/search', productController.getAllSearchProducts);

router.get('/:id', productController.getProductById); // Получить по ID
router.delete('/:id', productController.deleteProduct); // Удалить продукт

router.get('/', productController.getAllProducts); // Все продукты
router.post('/', productController.createProduct); // Добавить продукт

module.exports = router;