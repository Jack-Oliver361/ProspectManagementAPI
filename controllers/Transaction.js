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
        res.status(500).json({ message: err.message });
    }
}
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findById(transactionId)
        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found with id: " + req.params.id
            });
        }
        res.status(200).json(transaction);
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(500).json({ message: "ID invaild, make sure the id is correct" });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
}
exports.getTransactionsByDateRange = async (req, res) => {
    try {
        const startDate = new Date(req.params.startDate)
        const endDate = new Date(req.params.endDate)
        endDate.setHours(23, 59, 59, 0)
        const transactions = await Transaction.find({ date: { $gte: startDate, $lte: endDate } })
        if (transactions.length == 0) {
            return res.status(404).json({
                message: "Transaction not found within the given date range: " + startDate.toDateString() + " - " + endDate.toDateString()
            });
        }
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
exports.DeleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id
        const transaction = await Transaction.findByIdAndDelete(transactionId)
        if (transaction) {
            res.status(200).json({ message: "transaction deleted successfully!" });
        }
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(500).json({ message: "ID invaild, make sure the id is correct" });
        } else {
            res.status(500).json({ message: err.message });
        }
    }
}