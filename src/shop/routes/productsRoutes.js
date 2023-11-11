const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products_controller')

// Route to get all products
router.get('/get', productsController.getAllProducts);

// Route to get the count of all products
router.get('/count', productsController.getCount);

// Route to create a new product
router.post('/add', productsController.createProduct);

// Route to remove a product by ID
router.delete('delete/:productId', productsController.removeProducts);

module.exports = router;