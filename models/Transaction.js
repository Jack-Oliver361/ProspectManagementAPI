const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    products: [new mongoose.Schema({
        barcode: { type: String, ref: 'Product' },
        quantity: { type: Number },
        subtotal: { type: Number }
    }, { _id: false })],
    total: { type: Number },
    transactionBy: { type: mongoose.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Transaction', transactionSchema);