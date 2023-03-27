const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String },
    role: {type: String, enum: ["admin", "user"], default:"user"}
}, {strict: false});

module.exports = mongoose.model('User', userSchema);