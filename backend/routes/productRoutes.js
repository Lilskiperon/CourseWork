const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


router.get('/brands', productController.getBrandProducts);

router.get('/:id', productController.getProductById); // Получить по ID
router.delete('/:id', productController.deleteProduct); // Удалить продукт

router.get('/', productController.getAllProducts); // Все продукты
router.post('/', productController.createProduct); // Добавить продукт

module.exports = router;