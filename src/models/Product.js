const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true},
    quantity: { type: Number, required: true},
    description: { type: String},
    category: { type: mongoose.Types.ObjectId, required: true, ref: 'Category'}
});

module.exports = mongoose.model('Product', productSchema);