const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: [{
        type: String,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Category', categorySchema);