const express = require('express');
const AuthController = require('../../controllers/Auth');
const ProductController = require('../../controllers/Product');
const CategoryController = require('../../controllers/Category');
const { isSignedIn } = require("../../controllers/Auth");
const { adminCheck } = require("../../controllers/Auth");
const router = express.Router()

router.post('/signin', AuthController.signin);

router.use(isSignedIn)

router.get('/signout', adminCheck, AuthController.signout);


router.post('/signup', adminCheck, AuthController.signup);

router.post('/product', adminCheck, ProductController.addProduct);
router.get('/product', adminCheck, ProductController.getAllProducts);
router.get('/product/:id', adminCheck, ProductController.getProductById);
router.post('/category', adminCheck, CategoryController.addCategory);
router.get('/category', adminCheck, CategoryController.getAllCategories);
router.delete('/product/:id', adminCheck, ProductController.deleteProduct);

module.exports = router