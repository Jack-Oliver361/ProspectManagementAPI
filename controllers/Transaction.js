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
exports.getTransaction = async (req, res) => {
    try {

        res.status(200).json("test");
    } catch (err) {
    }
}