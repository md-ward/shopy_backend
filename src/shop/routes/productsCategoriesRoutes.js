const { Router } = require("express");
const {
  getAllProductCategories,
  createProductCategory,
} = require("../controllers/productCategoryController");
const authCheckMiddleware = require("../../global/adminAuthCheckMiddlewear");

const categoriesRoutes = Router();
categoriesRoutes.get("/", getAllProductCategories);
categoriesRoutes.post("/add", authCheckMiddleware, createProductCategory);

module.exports = categoriesRoutes;
