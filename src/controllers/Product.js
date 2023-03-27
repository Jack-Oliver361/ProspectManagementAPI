const Product = require('../models/Product');
const Category = require('../models/Category');
const mongoose = require('mongoose');
exports.addProduct = async (req, res) => {
    try{

        const { name, price, quantity, description, category } = req.body;
        const categoryId = await Category.findOne({ name: category}).distinct('_id')
        if(!categoryId[0]){
          return res.status(404).json({
            message: "Category not found: " + category
         });
        } 
        const product = await Product.create({name, price, quantity, description, category: categoryId[0] });
        console.log(product.id)
        await Category.findOneAndUpdate(categoryId[0], { $push: {products: product.id}});
        res.status(200).json(product);
    }catch(err){
        res.status(500).json({message: err.message || "Some error occurred while creating the product."});
    }

}

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found with id " + productId
            });
        }
        await Category.findOneAndUpdate( product.category ,{ $pull: {products: product.id}});
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Some error occurred while deleting the product."
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, quantity, description, category_id } = req.body;
        const product = await Product.findByIdAndUpdate(
          req.params._id,
          { name, price, quantity, description, category_id },
          { new: true }
        );
        if (!product) {
          return res.status(404).json({
            message: "Product not found with id " + req.params.id
          });
        }
        res.json(product);
      } catch (err) {
        res.status(500).json({
          message: err.message || "Some error occurred while updating the product."
        });
      }
}

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(404).json({
            message: "Product not found with id " + req.params.id
          });
        }
        res.json(product);
      } catch (err) {
        res.status(500).json({
          message: "Error retrieving product with id " + req.params.id
        });
      }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate({path: 'category' , select:'name -_id'});
        res.json(products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
      }
}

exports.getProductsInCategory = async (req, res) => {
  console.log("ffffffffffffff");
  try {
    
    const products = await Product.find({'category' : category.id})
    .populate({path: 'category' , select:'name -_id'})
    

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}
