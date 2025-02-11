const express = require('express');
const router = express.Router();
const packagingController = require('../controllers/packagingController');

router.get('/:id', packagingController.getPackagingById);
router.get('/product/:productId', packagingController.getPackagingByProduct);
router.post('/', packagingController.createPackaging);
router.put('/:id', packagingController.updatePackaging);
router.delete('/:id', packagingController.deletePackaging);

module.exports = router;
