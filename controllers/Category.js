const Category = require('../models/Category');
const Product = require('../models/Product');

const toTitleCase = (phrase) => {
  return phrase
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

exports.addCategory = async (req, res) => {
  try {

    const { name } = req.body;
    const addcategory = await Category.create({ name: toTitleCase(name) });
    res.status(200).json(addcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.getCategoryByName = async (req, res) => {
  try {
    const category = await Category.findOne({ name: toTitleCase(req.params.name) }).populate({ path: 'products' });
    if (!category) {
      return res.status(404).json({
        message: "Ctaegory not found with name: " + req.params.name
      });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving product with name: " + req.params.name
    });
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ name: toTitleCase(req.params.name) });
    const defaultCategory = await Category.findOne({ name: 'Uncategorized' });
    const products = await Product.updateMany({ category: category.id }, { category: defaultCategory.id });
    await Category.findOneAndUpdate(defaultCategory.id, { $push: { products: category.products } });
    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully!, All product under this category moved to Uncategorized" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}