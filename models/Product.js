const mongoose = require('mongoose');
const Category = require('../models/Category');
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    orderLimit: { type: Number, min: 0, default: 0 },
    description: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'Category', default: '642da5e3c7d14913d5eb07fb' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

productSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const productId = this.getQuery()['_id'];
        const { category: newCategoryId } = this._update;

        // check if category is being updated
        if (newCategoryId) {
            const doc = await this.model.findOne({ _id: productId });
            const oldCategoryId = doc.category;
            const [oldCategory, newCategory] = await Promise.all([
                Category.findByIdAndUpdate(oldCategoryId, { $pull: { products: productId } }),
                Category.findByIdAndUpdate(newCategoryId, { $addToSet: { products: productId } }, { new: true })
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

productSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await this.model('Category').update({ products: this._id }, { $pull: { products: this._id } });
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Product', productSchema);