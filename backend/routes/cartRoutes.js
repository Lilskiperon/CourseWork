const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');

router.get('/', cartItemController.getCartProducts);
router.post('/', cartItemController.addToCart);
router.put('/:id', cartItemController.updateQuantity);
router.delete("/all", cartItemController.removeAllFromCart);
router.delete("/", cartItemController.removeFromCart);

module.exports = router;
