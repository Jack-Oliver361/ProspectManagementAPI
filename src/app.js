require('dotenv').config('../../.env');

const express = require('express');
const app = express();
const routes = require('./routes/v1');

app.use(express.json());

    
app.use('/v1', routes);


module.exports = app;