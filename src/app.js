require('dotenv').config('../../.env');

const express = require('express');
const app = express();
const routes = require('./routes/v1');
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
    
app.use('/v1', routes);

module.exports = app;