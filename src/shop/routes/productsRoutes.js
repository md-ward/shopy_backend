const express = require("express");
const productRouts = express.Router();
const productsController = require("../controllers/productsController");
const multer = require("multer");
const adminAuthCheckMiddleware = require("../../global/adminAuthCheckMiddlewear");
const upload = multer();

productRouts.get("/featured", productsController.getFeaturedProducts);
//! Route to apply filters
productRouts.get("/filter", productsController.applyFilters);

//! Route to search products
productRouts.get("/search", productsController.searchProducts);

//! Route to get all products
productRouts.get("/get/:currentPage", productsController.getAllProducts);
productRouts.get("/:id", productsController.getSingleProduct);

//! Route to create a new product
productRouts.post(
  "/add",
  adminAuthCheckMiddleware,
  upload.none(),
  productsController.createProduct
);
productRouts.put(
  "/featured/update",
  adminAuthCheckMiddleware,
  productsController.updateFeaturedProduct
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

module.exports = productRouts;
