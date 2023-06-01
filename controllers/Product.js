const Product = require('../models/Product');
const Category = require('../models/Category');



exports.addProduct = async (req, res) => {
  try {
    const { barcode, name, price, quantity, orderLimit, description, category } = req.body;
    const categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } })
    if (!categoryDoc) {
      res.status(404).json({ message: "The category: " + category + " is not available, Please create a new category first" });
    }
    const product = await Product.create({ barcode, name, price, quantity, orderLimit, description, category: categoryDoc._id })
    res.status(200).json(product);
  } catch (err) {
    if (err.code === 11000) {
      res.status(500).json({ message: "The field: '" + err.message.split(" ").map((el, key, array) => el.includes("index:") && array[key + 1]).filter(Boolean)[0].replace(/\_\d+/g, "") + "' must be unquie" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.barcode;
    const product = await Product.findOneAndDelete({ barcode: req.params.barcode })
    if (!product) {
      return res.status(404).json({
        message: "Product not found with barcode: " + productId
      });
    }
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while deleting the product."
    });
  };
}

exports.updateProduct = async (req, res) => {
  try {
    const { barcode, name, price, quantity, orderlimit, description, category } = req.body;
    const categoryId = await Category.findOne({ name: { $regex: category, $options: 'i' } }).distinct('_id')
    const product = await Product.findOneAndUpdate(
      { barcode: req.params.barcode },
      { barcode, name, price, quantity, orderlimit, description, category: categoryId[0] },
      { new: true }
    ).populate('category', 'name _id');
    if (!product) {
      return res.status(404).json({
        message: "Product not found with id " + req.params.barcode
      });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while updating the product."
    });
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode }).populate({ path: 'category', select: 'name -_id' });
    if (!product) {
      return res.status(404).json({
        message: "Product not found with id " + req.params.barcode
      });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving product with id " + req.params.barcode
    });
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({ path: 'category', select: 'name -_id' });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving products. Please try again later' });
  }
}