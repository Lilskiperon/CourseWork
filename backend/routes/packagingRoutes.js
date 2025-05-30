const express = require('express');
const router = express.Router();
const packagingController = require('../controllers/packagingController');


router.get('/new-arrivals', packagingController.getNewArrivals); // Новинки
router.get('/recommendations', packagingController.getRecommendations); // Рекомендации
router.get('/filter-products', packagingController.getSearchProductsByParams); // Поиск
router.get('/search', packagingController.getAllSearchProducts); 
router.get('/:id', packagingController.getPackagingById);
router.get('/product/:productId', packagingController.getPackagingByProduct);
router.post('/', packagingController.createPackaging);
router.put('/:id', packagingController.updatePackaging);
router.delete('/:id', packagingController.deletePackaging);
router.get('/', packagingController.getPackagings);
module.exports = router;
