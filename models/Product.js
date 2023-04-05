const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'Category', default: '642da5e3c7d14913d5eb07fb' }
});



module.exports = mongoose.model('Product', productSchema);