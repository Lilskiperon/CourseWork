const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');


router.post("/create-checkout-session", paymentController.createCheckoutSession);
router.post("/checkout-success", paymentController.checkoutSuccess);

module.exports = router;