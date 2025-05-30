const mongoose = require('mongoose');

const packagingSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productImageUrl: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true }
}, { timestamps: true });

const Packaging = mongoose.model('Packaging', packagingSchema);

module.exports = Packaging;
