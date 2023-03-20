const express = require('express');
const AuthController = require('../../controllers/Auth');
const {isSignedIn}=require("../../controllers/Auth");
const router = express.Router()

router.get('/', isSignedIn, (req, res) => {
    res.send('Hello World!')
    
});

router.post('/signup', isSignedIn, AuthController.signup);
router.post('/signin',AuthController.signin);
router.get('/signout',AuthController.signout);

module.exports = router