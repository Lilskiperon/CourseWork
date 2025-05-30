const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
    form: { type: String },
    type: { type: String },
    description: { type: String },
    nutritionalValue: { type: Number },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
