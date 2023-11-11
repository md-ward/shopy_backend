const { Router } = require('express');
const { registerAdmin, loginAdmin, sendPasswordReset, checkUserAndSendPinCode } = require('../controllers/admin_controller');

const admin_routes = Router();

admin_routes.post('/admin_signup', registerAdmin);
admin_routes.post('/admin_login', loginAdmin);
admin_routes.post('/reset_password', checkUserAndSendPinCode);
admin_routes.post('/confirm_pincode', sendPasswordReset);

module.exports = admin_routes;