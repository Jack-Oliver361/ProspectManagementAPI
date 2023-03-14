const mongoose = require('mongoose');
const app = require('./app');


let server
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true,}).then(() => {
    console.log('Connected to Database');
        server = app.listen(process.env.PORT, () => {
            console.log(`Listening to port ${process.env.PORT}`);
        });
    });