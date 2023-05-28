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
        const transactions = await Transaction.find()
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
exports.getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findById(transactionId)
        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
exports.getTransactionsByDateRange = async (req, res) => {
    try {
        const startDate = new Date(req.params.startDate)
        const endDate = new Date(req.params.endDate)
        const transactions = await Transaction.find({ date: { $gte: startDate, $lte: endDate }})
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
exports.DeleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findByIdAndDelete(transactionId)
        res.json(transaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}