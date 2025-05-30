const express = require("express");
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

router.get("/", comparisonController.getComparisonProducts);
router.post("/", comparisonController.addToComparison);
router.delete("/", comparisonController.removeFromComparison);


module.exports = router;