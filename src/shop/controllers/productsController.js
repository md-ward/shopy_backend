const Product = require("../models/productsModel");
exports.getAllProducts = async (req, res) => {
  try {
    const totalCount = await Product.countDocuments();
    const currentPage = req.params.currentPage || 1;
    const pages =5|| Math.ceil(totalCount / 12);
    const skipIndex = (currentPage - 1) * 12;

    const products = await Product.find()
      .populate("image", "-__v -uploadedAt")
      .limit(12)
      .skip(skipIndex)
      .sort({
        added_date: -1,
      });

    res.status(200).json({ pages, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const products = await Product.findOne({ _id: productId }).populate(
      "image",
      "-__v -uploadedAt"
    );

    res.status(200).send(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let productFormData = req.body;
    productFormData.category = productFormData.category.split(",");
    console.log(productFormData);

    const existingProduct = await Product.findOne({
      $and: [
        { product_name: productFormData.product_name },
        { image: productFormData.image },
      ],
    });
    if (existingProduct) {
      return res.status(400).send({ message: "Product already exists" });
    }

    const product = new Product(productFormData);

    // Save the new product to the database
    await product.save();

    res.status(201).send(product);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const productUpdates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productUpdates,
      { new: true }
    ).populate("image", "-__v -uploadedAt");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeProducts = async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    return res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.applyFilters = async (req, res) => {
  try {
    const { categories, minPrice, maxPrice } = req.query;

    let query = {};

    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      query.price = { $gte: minPrice };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice };
    }
    console.log(query);
    const filteredProducts = await Product.find(query)
      .populate("image", "-__v -uploadedAt")
      .sort({ added_date: -1 });

    res.status(200).json(filteredProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const regex = new RegExp(`^${searchTerm}`, "i");

    const searchResults = await Product.find({
      $or: [{ product_name: regex }, { category: regex }],
    })
      .select(["product_name", "price"])
      .populate("image", "thumbnailUrl -_id")
      .sort({ added_date: -1 });

    res.status(200).json(searchResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
