require('cookie-parser')
require('dotenv').config('../../.env');

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { expressjwt } = require("express-jwt");
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!(username && password)) {
            return res.status(400).send('All input is required')
        }
        const oldUser = await User.findOne({ username });
        if(oldUser) {
            return res.status(409).send('User already exists. Please login.');
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,password:encryptedPassword
        })
        res.status(200).json(user);
    }catch (error) {
        res.status(400).json({
            error: 'Please enter your email and password'
        })
    }
}

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ status: 'error', error: 'Invalid username/password' })
        }
        const passwordcompare = await bcrypt.compare(password, user.password);
        if(passwordcompare){
            const token = jwt.sign({
                id: user._id,
                username: user.username
            },process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRSE}
        )
        return res.status(200).cookie('jwt', token).json({ username: user.username})
        }else{
            return res.status(401).json({ status: 'error', error: 'Make sure your password is correct!'})
        }
    } catch (error) {
        console.log(error);
    }
}

exports.isSignedIn = expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty:'auth',
    algorithms: ['HS256'],
    getToken: function(req) {
        if (req.cookies['jwt']) {
         return req.cookies['jwt'];
        }
        return null;
       }
})