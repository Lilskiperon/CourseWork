const express = require('express');
const router = express.Router();
const flavorController = require('../controllers/flavorController');

router.get('/', flavorController.getAllFlavors);
router.get('/product/:packagingId', flavorController.getFlavorsByPackagingId);  // Получить все вкусы
router.get('/:flavorId', flavorController.getFlavorsById);              
router.post('/', flavorController.createFlavor);                        
router.put('/:id', flavorController.updateFlavor);                      
router.delete('/:id', flavorController.deleteFlavor);                  
router.post('/products', flavorController.getProductsByIds);  

module.exports = router;