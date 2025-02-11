const express = require('express');
const router = express.Router();
const flavorController = require('../controllers/flavorController');

router.get('/', flavorController.getAllFlavors);                                     // Получить все вкусы
router.get('/:packagingId', flavorController.getFlavorsByPackagingId);               // Получить вкусы по packagingId
router.post('/', flavorController.createFlavor);                                     // Добавить новый вкус
router.put('/:id', flavorController.updateFlavor);                                   // Обновить вкус
router.delete('/:id', flavorController.deleteFlavor);                                // Удалить вкус

module.exports = router;
