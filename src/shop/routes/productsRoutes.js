const express = require("express");
const productRouts = express.Router();
const productsController = require("../controllers/productsController");
const multer = require("multer");
const adminAuthCheckMiddleware = require("../../global/adminAuthCheckMiddlewear");
const upload = multer();
//! Route to get all products
productRouts.get("/", productsController.getAllProducts);
productRouts.get("/get/:id", productsController.getSingleProduct);

//! Route to create a new product
productRouts.post(
  "/add",
  adminAuthCheckMiddleware,
  upload.none(),
  productsController.createProduct
);
productRouts.put(
  "/update/:productId",
  adminAuthCheckMiddleware,
  upload.none(),
  productsController.updateProduct
);

//! Route to remove a product by ID
productRouts.delete(
  "/delete/:productId",
  adminAuthCheckMiddleware,
  productsController.removeProducts
);
//! Route to apply filters
productRouts.get("/filter", productsController.applyFilters);

//! Route to search products
productRouts.get("/search", productsController.searchProducts);

module.exports = productRouts;
