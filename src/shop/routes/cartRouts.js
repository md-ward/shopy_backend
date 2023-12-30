const { Router } = require("express");
const {
  getCartItems,
  addToCart,
  removeItem,
} = require("../controllers/cartController");

const cartRouts = Router();
cartRouts.get("/", getCartItems);
cartRouts.post("/add", addToCart);
cartRouts.post("/remove", removeItem);
cartRouts.post("/clear", removeItem);

module.exports = cartRouts;
