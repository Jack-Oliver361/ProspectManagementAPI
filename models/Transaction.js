const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    products: [{
        item: { type: String },
        quantity: { type: Number },
        subtotal: { type: Number }
    }, { _id: false }],
    total: { type: Number },
    transactionBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Transaction', transactionSchema);