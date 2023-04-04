const mongoose = require('mongoose');
const app = require('./app');
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
// Determine protocol based on environment
const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
// Start server
let server;
if (protocol === "https") {
    const httpsOptions = {
        key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
    };
    server = https.createServer(httpsOptions, app);
} else {
    server = http.createServer(app);
}

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
    console.log('Connected to Database');
    server.listen(process.env.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`);
    });
});