const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    products: [{
        type: String,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Category', categorySchema);