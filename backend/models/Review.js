const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    rating: { type: Number, required: false },
    description: { type: String, required: false },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
