const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
    try{
        
        const { name } = req.body;
        console.log(name);
        const addcategory = await Category.create({name});
        console.log(addcategory);
        res.status(200).json(addcategory);
    }catch(err){
    }

}