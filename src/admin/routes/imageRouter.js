const { Router } = require("express");
const {
  uploadImage,
  getAllImages,
} = require("../controllers/productsImagesController");
const adminAuthCheckMiddleware = require("../../global/adminAuthCheckMiddlewear");

const upload_Routes = Router();
upload_Routes.post("/upload", adminAuthCheckMiddleware, uploadImage);
upload_Routes.get("/images/thumbs", getAllImages);
module.exports = upload_Routes;
