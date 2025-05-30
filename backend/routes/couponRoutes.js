const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

router.get('/', couponController.getCoupon);
router.post('/validate', couponController.validateCoupon);

module.exports = router;
