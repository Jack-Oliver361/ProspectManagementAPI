const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const Category = require('./models/Category');
const Product = require('./models/Product');

// Start server;
let server = http.createServer(app);


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
    console.log('Connected to Database');
    Promise.all([Product.createIndexes(), Category.createIndexes()]);
    server.listen(process.env.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`);
    });
});