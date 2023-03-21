const express = require('express');
const AuthController = require('../../controllers/Auth');
const ProductController = require('../../controllers/Product');
const CategoryController = require('../../controllers/Category');
const {isSignedIn}=require("../../controllers/Auth");
const router = express.Router()

router.get('/', isSignedIn, (req, res) => {
    res.send('Hello World!')
    
});

router.post('/signup', isSignedIn, AuthController.signup);
router.post('/signin',AuthController.signin);
router.get('/signout',AuthController.signout);

router.post('/product', ProductController.addProduct);
router.get('/product', ProductController.getAllProducts);
router.post('/category', CategoryController.addCategory);

module.exports = router