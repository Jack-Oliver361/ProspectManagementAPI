require('dotenv').config('./.env');

const express = require('express');
const app = express();
const routes = require('./routes/v1');
const cookieParser = require("cookie-parser");
var cors = require('cors')


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3080/"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Invalid token', error: err.inner.message });
    }
});
app.use(function (req, res) {
    // Invalid request
    res.status(404).json({ message: 'Invalid Request' });
});
module.exports = app;