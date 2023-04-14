const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, "{PATH}: {VALUE} already exsists please login or use a different username"],
        match: [
            new RegExp('^[a-z0-9_.-]+$', 'i'),
            '\'{VALUE}\' is not valid. Use only letters, numbers, underscore or dot.'
        ],
        minlength: 5,
        maxlength: 30,
    },
    password: { type: String },
    role: { type: String, enum: ["admin", "user"], default: "user" }
});
userSchema.post("save", function (error, doc, next) {

    if (error.code === 11000) {
        Object.entries(error.keyValue).forEach(([key, value]) => {
            next(new Error(key + ": " + value + ", is already taken. Please login or try a different username"))
        })
    } else {
        next(error)
    }
});
module.exports = mongoose.model('User', userSchema);