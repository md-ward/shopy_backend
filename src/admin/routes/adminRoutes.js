const { Router } = require("express");
const {
  registerAdmin,
  loginAdmin,
  sendPasswordReset,
  checkUserAndSendPinCode,
} = require("../controllers/adminController");
const adminAuthCheckMiddleware = require("../../global/adminAuthCheckMiddlewear");
const { getStatistics } = require("../controllers/statisticsController");

const admin_routes = Router();

admin_routes.post("/admin_signup", registerAdmin);
admin_routes.post("/admin_login", loginAdmin);
admin_routes.post("/reset_password", checkUserAndSendPinCode);
admin_routes.post("/confirm_pincode", sendPasswordReset);

admin_routes.get("/statistics", getStatistics);

module.exports = admin_routes;
