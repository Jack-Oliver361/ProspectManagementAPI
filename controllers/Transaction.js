const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');


exports.saveTransaction = async (req, res) => {
    try {
        const { products } = req.body;
        let total = 0;
        for (let product of products) {
            total += product.subtotal
        }
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const transactionBy = decoded.id;

        const transaction = await Transaction.create({ products, total, transactionBy })
        res.status(200).json(transaction);
    } catch (err) {
        console.log(err)
    }
}
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate({
            path: 'products.item',
            model: 'Product',
            foreignField: 'barcode',
            select: 'barcode name -_id'
        }).lean();
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}