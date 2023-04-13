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
    this._categoryUpdated = false
    if (categoryChange) {
        try {
            const doc = await this.model.findOne(this.getQuery()).select('category -_id');
            this._OldCategory = doc.category
            this._categoryUpdated = true
            next()
        } catch (err) {
            next(new Error("Product barcode: " + this.getQuery().barcode + " not found"))
        }
    }
});

productSchema.post('findOneAndUpdate', async function (doc, next) {
    if (doc) {
        if (this._categoryUpdated) {
            await Category.findByIdAndUpdate(this._OldCategory, { $pull: { products: doc.barcode } });
            await Category.findByIdAndUpdate(doc.category, { $push: { products: doc.barcode } });
        }
        next()
    }
});
productSchema.post('findOneAndDelete', async function (doc, next) {
    if (doc) {
        try {
            console.log(doc);
            await Category.findByIdAndUpdate(doc.category, { $pull: { products: doc.barcode } });
            next();
        } catch (err) {
            next(err);
        }
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