const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
  try {

    const { name } = req.body;
    const addcategory = await Category.create({ name });
    res.status(200).json(addcategory);
  } catch (err) {
  }

}

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate({ path: 'products' });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
}