const express = require("express");
const orderRoutes = express.Router();
const {
  createOrder,
  getOrders,
  deleteOrderById,
  getOrderDetails,
  updateOrderStatus,
  getUserOrders,
} = require("../controllers/ordersController");
const userAuthCheckMiddleware = require("../../global/userAuthCeckMiddlewear");
const adminAuthCheckMiddleware = require("../../global/adminAuthCheckMiddlewear");
const multer = require("multer");
const upload = multer();
orderRoutes.get("/user", userAuthCheckMiddleware, getUserOrders);

orderRoutes.get("/user/:orderId", userAuthCheckMiddleware, getOrderDetails);
orderRoutes.put("/user/:orderId", userAuthCheckMiddleware, updateOrderStatus);

// Create a new order
orderRoutes.post("/add", upload.none(), userAuthCheckMiddleware, createOrder);

// Get all orders with user and product details
orderRoutes.get("/", adminAuthCheckMiddleware, getOrders);
orderRoutes.get("/:orderId", adminAuthCheckMiddleware, getOrderDetails);
orderRoutes.put("/:orderId", adminAuthCheckMiddleware, updateOrderStatus);

// Delete an order by ID

orderRoutes.delete(
  "/delete/:orderId",
  adminAuthCheckMiddleware,
  deleteOrderById
);

module.exports = orderRoutes;
