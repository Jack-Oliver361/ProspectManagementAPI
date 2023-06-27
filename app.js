require('dotenv').config('./.env');

const express = require('express');
const app = express();
const routes = require('./routes/v1');
const cookieParser = require("cookie-parser");
var cors = require('cors')

var corsOptions = {
    origin: 'http://localhost:3080/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
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