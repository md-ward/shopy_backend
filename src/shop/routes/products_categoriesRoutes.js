const { Router } = require("express");
const { getAllProductCategories, createProductCategory } = require("../controllers/product_category_controller");

const categoriesRoutes = Router();
categoriesRoutes.get('/all_categories', getAllProductCategories);
categoriesRoutes.post('/new_category', createProductCategory);

module.exports = categoriesRoutes;