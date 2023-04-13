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
    if (err.code === 11000) {
      res.status(500).json({ message: "The field: '" + err.message.split(" ").map((el, key, array) => el.includes("index:") && array[key + 1]).filter(Boolean)[0].replace(/\_\d+/g, "") + "' must be unquie" });
    } else {
      res.status(500).json({ message: "You must provide the name of the category" });
    }

  }
}

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not retrieve all the categories' });
  }
}

exports.getCategoryByName = async (req, res) => {
  try {
    const category = await Category.findOne({ name: toTitleCase(req.params.name) }).populate({
      path: 'products',
      model: 'Product',
      foreignField: 'barcode'
    });
    if (!category) {
      return res.status(404).json({
        message: "Category not found with name: " + req.params.name
      });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({
      errorMessage: err.message
    });
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    if (req.params.name != 'Uncategorized') {
      const category = await Category.findOne({ name: toTitleCase(req.params.name) });
      if (!category) {
        return res.status(404).json({
          message: "Category not found with name: " + req.params.name
        });
      }
      const defaultCategory = await Category.findOne({ name: 'Uncategorized' });
      const products = await Product.updateMany({ category: category.id }, { category: defaultCategory.id });
      await Category.findOneAndUpdate(defaultCategory.id, { $push: { products: category.products } });
      await category.deleteOne();
      res.status(200).json({ message: "Category deleted successfully!, All product under this category moved to Uncategorized" });
    } else {
      res.status(500).json({ message: "You can not delete the default category" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}