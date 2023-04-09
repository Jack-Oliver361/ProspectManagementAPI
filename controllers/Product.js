const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');


exports.addProduct = async (req, res) => {
  const { barcode, name, price, quantity, orderLimit, description, category } = req.body;
  const categoryDoc = await Category.findOne({ name: category })
  if (!categoryDoc) {
    res.status(500).json({ message: "The category: " + category + " is not available, Please create a new category first" });
  }
  const product = await Product.create({ barcode, name, price, quantity, orderLimit, description, category: categoryDoc._id }).then(() => {
    res.status(200).json(product);
  }).catch(err => {
    if (err.code === 11000) {
      res.status(500).json({ message: "The field: '" + err.message.split(" ").map((el, key, array) => el.includes("index:") && array[key + 1]).filter(Boolean)[0].replace(/\_\d+/g, "") + "' must be unquie" });
    } else {
      res.status(500).json({ message: err.name });
    }
  });
}

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.barcode;
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (product.length == 0) {
      console.log(product)
      return res.status(404).json({
        message: "Product not found with id " + productId
      });
    }
    //await Category.findOneAndUpdate(product.category, { $pull: { products: product.id } });
    await product.deleteOne()
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while deleting the product."
    });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { barcode, name, price, quantity, orderlimit, description, category } = req.body;
    const categoryId = await Category.findOne({ name: category }).distinct('_id')
    const product = await Product.findOneAndUpdate(
      { barcode: req.params.barcode },
      { barcode, name, price, quantity, orderlimit, description, category: categoryId[0] },
      { new: true }
    ).populate('category', 'name -_id');
    if (!product) {
      return res.status(404).json({
        message: "Product not found with id " + req.params.barcode
      });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: err.message + "ffff" || "Some error occurred while updating the product."
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
    res.json(product);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving product with id " + req.params.barcode
    });
  }
}

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate({ path: 'category', select: 'name -_id' });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.getProductsInCategory = async (req, res) => {
  try {

    const products = await Product.find({ 'category': category.id })
      .populate({ path: 'category', select: 'name -_id' })


    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}
