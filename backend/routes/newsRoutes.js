const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Маршруты для работы с новостями
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', newsController.addNews);
router.put('/:id', newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

module.exports = router;
