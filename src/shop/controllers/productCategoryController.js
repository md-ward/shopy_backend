const product_categoryModel = require("../models/productCategoryModel");
exports.createProductCategory = async (req, res) => {
  try {
    let { category } = req.body;
    console.log(category);

    const existingCategory = await product_categoryModel.findOne({
      category: category.toLowerCase(),
    });

    if (existingCategory) {
      return res.status(500).send({ message: "Category already exists" });
    }

    const newCategory = new product_categoryModel({
      category,
    });

    await newCategory.save();
    res.status(201).send(newCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Problem adding category" });
  }
};
exports.getAllProductCategories = async (req, res) => {
  try {
    const categories = await product_categoryModel.find();
    // console.log(categories);
    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "problem in retriving categories" });
  }
};
