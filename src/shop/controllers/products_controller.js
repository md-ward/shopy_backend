const Product = require('../models/productsModel');

//! Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//* Create a new product
exports.createProduct = async (req, res) => {
  const product = new Product({
    product_name: req.body.product_name,
    description: req.body.description,
    price: req.body.price,
    rate: req.body.rate,
    product_type: req.body.product_type,
    images: req.body.images
  });

  try {
    //! Save the new product to the database
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removeProducts = async (req, res) => {

  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    return res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}



//? Get the count of all products
exports.getCount = async (req, res) => {
  try {
    //* Use the countDocuments() method to get the count of all products
    const count = await Product.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};