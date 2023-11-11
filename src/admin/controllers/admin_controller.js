const Admin = require('../models/admin_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendCookie = require('../../global/sendCookie');

const path = require('path');

// Register a new admin
async function registerAdmin(req, res) {
    const { userName, email, password } = req.body;

    try {
        // Check if admin with the same username or email already exists
        const existingAdmin = await Admin.findOne({ $or: [{ userName: userName }, { email: email }] });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin instance
        const admin = new Admin({
            userName: userName,
            email: email,
            password: hashedPassword
        });

        // Save the admin to the database
        await admin.save();

        const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, { expiresIn: '30d' });



        sendCookie(res, 'admin_jwt', token);
        return res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Login function
async function loginAdmin(req, res) {
    const { username, password } = req.body;


    try {
        // Check if admin with the provided username exists


        const admin = await Admin.findOne({ userName: username });
        if (!admin) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate a new JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, { expiresIn: '30d' });


        return res.status(200).json(token);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function checkUserAndSendPinCode(req, res) {
    const { email } = req.body;

    try {
        // Check if admin with the provided email exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Generate a random PIN code
        const pinCode = Math.floor(100000 + Math.random() * 900000);

        // Save the PIN code and its expiry date in the admin document
        admin.resetPasswordPin.pinCode = pinCode;
        admin.resetPasswordPin.createdAt = Date.now() + 600000; // PIN code expires in 10 minutes
        await admin.save();

        return res.status(200).json({ message: `enter this pin code to continue ${pinCode}` });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function sendPasswordReset(req, res) {
    try {
        const { pinCode } = req.body;

        // Find the admin with the provided PIN code
        const admin = await Admin.findOne({ "resetPasswordPin.pinCode": pinCode });
        if (!admin) {
            return res.status(404).json({ message: "Invalid PIN code" });
        }

        // Check if the PIN code has expired
        if (admin.resetPasswordPin.createdAt < Date.now()) {
            return res.status(400).json({ message: "PIN code has expired" });
        } else {
            // Generate the password reset token
            const passwordResetToken = jwt.sign({ id: admin._id }, process.env.SECRET_KEY);

            // Update the admin document with the password reset token and clear the resetPasswordPin field
            admin.resetPasswordPin.passwordResetToken = passwordResetToken;
            admin.resetPasswordPin = null;
            await admin.save();

            // Send the reset password HTML file to the user along with the password reset token in the response header
            const filePath = path.resolve(__dirname, "..", "view", "resetPassword.html");
            res.setHeader('token',passwordResetToken)
            
            res.sendFile(filePath);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = {
    registerAdmin,
    loginAdmin,
    sendPasswordReset
    ,
    checkUserAndSendPinCode
};