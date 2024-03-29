require('cookie-parser')
require('dotenv').config('../.env');

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { expressjwt } = require("express-jwt");
const bcrypt = require('bcrypt');


exports.signup = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!(username && password)) {
            return res.status(400).send('All input is required')
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username, password: encryptedPassword, role
        })
        res.status(200).json({ message: 'User: ' + user.username + ' created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.signin = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid username/password' })
        }

        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(401).json({ status: 'error', message: 'Invalid username/password' })
        }

        const token = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })

        res.cookie("token", token, { httpOnly: true, sameSite: 'none', secure: true })
        res.status(200).json({ message: "Login successful" })

    } catch (err) {
        res.status(500).json({ message: err.message })

    }
}
exports.signout = async (req, res) => {
    try {
        res.status(200).clearCookie('token').json({ message: 'logged out' });
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


exports.isSignedIn =
    expressjwt({
        secret: process.env.JWT_SECRET,
        userProperty: 'auth',
        algorithms: ['HS256'],
        getToken: function (req) {
            if (req.cookies['token']) {
                return req.cookies['token'];
            }
            return null;
        }
    })



exports.adminCheck = (req, res, next) => {
    try {
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Insufficient permissions" });
        }
        next()
    } catch (err) {
        return res.status(401).send({ message: `No Access token provided` })

    }
}