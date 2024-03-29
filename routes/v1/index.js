const express = require('express');
const AuthController = require('../../controllers/Auth');
const ProductController = require('../../controllers/Product');
const CategoryController = require('../../controllers/Category');
const TransactionController = require('../../controllers/Transaction');
const { isSignedIn } = require("../../controllers/Auth");
const { adminCheck } = require("../../controllers/Auth");
const router = express.Router()

router.post('/signin', AuthController.signin);

router.use(isSignedIn)

router.get('/signout', adminCheck, AuthController.signout);


router.post('/signup', adminCheck, AuthController.signup);

router.post('/product', adminCheck, ProductController.addProduct);
router.get('/product', adminCheck, ProductController.getAllProducts);
router.get('/product/:barcode', adminCheck, ProductController.getProductById);
router.patch('/product/:barcode', adminCheck, ProductController.updateProduct);
router.delete('/product/:barcode', adminCheck, ProductController.deleteProduct);

router.post('/category', adminCheck, CategoryController.addCategory);
router.get('/category', adminCheck, CategoryController.getAllCategories);
router.get('/category/:name', adminCheck, CategoryController.getCategoryByName);
router.delete('/category/:name', adminCheck, CategoryController.deleteCategory);


router.post('/transaction', adminCheck, TransactionController.saveTransaction);
router.get('/transaction', adminCheck, TransactionController.getAllTransactions);
router.get('/transaction/:id', adminCheck, TransactionController.getTransactionById);
router.get('/transaction/:startDate/:endDate', adminCheck, TransactionController.getTransactionsByDateRange);
router.delete('/transaction/:id', adminCheck, TransactionController.DeleteTransaction);


module.exports = router