const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');

// Start server;
let server = http.createServer(app);


mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
    console.log('Connected to Database');
    server.listen(process.env.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`);
    });
});