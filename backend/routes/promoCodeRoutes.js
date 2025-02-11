const express = require('express');
const router = express.Router();
const promoCodeController = require('../controllers/promoCodeController');

router.get('/', promoCodeController.getAllPromoCodes);
router.get('/:code', promoCodeController.checkPromoCode);
router.post('/apply', promoCodeController.applyPromoCode);

module.exports = router;
