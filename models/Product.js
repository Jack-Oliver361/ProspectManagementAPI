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
    try {
        const barcode = this.getQuery()['barcode'];
        const { category: newCategoryId } = this._update;
        // check if category is being updated
        if (newCategoryId) {
            const doc = await this.model.findOne({ barcode: barcode }).lean();
            const oldCategoryId = doc.category;
            const [oldCategory, newCategory] = await Promise.all([
                Category.findByIdAndUpdate(oldCategoryId, { $pull: { products: barcode } }),
                Category.findByIdAndUpdate(newCategoryId, { $addToSet: { products: barcode } }, { new: true })
            ]);

            if (!oldCategory || !newCategory) {
                throw new Error('Could not update categories');
            }
        }

        next();
    } catch (err) {
        next(err);
    }
});

productSchema.pre('findOneAndDelete', async function (next) {
    try {
        const doc = await this.model.findOne({ barcode: this.getQuery().barcode }).lean();
        await Category.findByIdAndUpdate(doc.category, { $pull: { products: doc.barcode } });
        next();
    } catch (err) {
        next(err);
    }
});

productSchema.post('save', async function (doc, next) {
    try {
        console.log("hi");
        await Category.findByIdAndUpdate(this.category, { $push: { products: this.barcode } });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Product', productSchema);