const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: false },
    author: { type: String, required: false },
    date: { type: Date, required: true },
    image_url: { type: String, required: false },
    content: { type: String, required: true }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

module.exports = News;
