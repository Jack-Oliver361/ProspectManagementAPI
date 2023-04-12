const mongoose = require('mongoose');
const Category = require('../models/Category');
const productSchema = new mongoose.Schema({
    barcode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    orderLimit: { type: Number, min: 0, default: 0 },
    description: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('findOneAndUpdate', async function (next) {
    const { category: categoryChange } = this._update
    console.log("aaaa")
    if (categoryChange) {
        console.log('hi111')
        this._oldDoc = await this.model.findOne(this.getQuery());
    }
});

productSchema.post('findOneAndUpdate', async function (doc) {
    console.log("aaaa2")
    const oldDoc = this._oldDoc;
    console.log("aaaa3")
    if (oldDoc && oldDoc.category !== doc.category) {
        console.log("aaaa4")
        await Category.findByIdAndUpdate(oldDoc.category, { $pull: { products: oldDoc.barcode } });
        await Category.findByIdAndUpdate(doc.category, { $push: { products: doc.barcode } });
    }
});
productSchema.post('findOneAndDelete', async function (doc, next) {
    try {
        await Category.findByIdAndUpdate(doc.category, { $pull: { products: doc.barcode } });
        next();
    } catch (err) {
        next(err);
    }
});

productSchema.post('save', async function (doc, next) {
    try {
        await Category.findByIdAndUpdate(doc.category, { $push: { products: doc.barcode } });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Product', productSchema);