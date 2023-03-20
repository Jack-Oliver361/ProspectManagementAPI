require('dotenv').config('../../.env');

const express = require('express');
const app = express();
const routes = require('./routes/v1');
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({message: 'Invalid token', error: err.inner.message});
    }
    next(err)
});
module.exports = app;