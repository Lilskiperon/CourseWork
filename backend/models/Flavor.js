const mongoose = require('mongoose');


const flavorSchema = new mongoose.Schema({
    packagingId: {  type: mongoose.Schema.Types.ObjectId,  ref: 'Packaging', required: true },
    flavorName: { type: String, required: false  },
    stockQuantity: { type: Number, required: false },
}, { timestamps: true });

const Flavor = mongoose.model('Flavor', flavorSchema);

module.exports = Flavor;
