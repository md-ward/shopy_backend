const express = require('express');
const router = express.Router();
const { createOrder, getOrders, deleteOrderById } = require('../controllers/orders_controller');

// Create a new order
router.post('/newOrder', createOrder);

// Get all orders with user and product details
router.get('/get', getOrders);

// Delete an order by ID
router.delete('/delete/:orderId', deleteOrderById);

module.exports = router;