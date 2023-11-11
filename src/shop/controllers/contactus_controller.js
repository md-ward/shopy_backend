const ContactUs = require("../models/contactusModel");
const validator = require("email-validator");

// ! Get all contact form submissions
exports.getAllContactsCount = async (req, res) => {

    try {
        //* Use the countDocuments() method to get the count of all products
        const count = await ContactUs.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactUs.find();
        if (contacts.length == 0) {
            throw Error('No Messages');
        }
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error retrieving contacts:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new contact form submission
exports.createMessage = async (req, res) => {
    const { user_name, email, message } = req.body;

    // Validate the email field
    if (!validator.validate(email)) {
        console.log(email)
        return res.status(400).send({ message: 'Invalid email address.' });
    }

    try {
        const newMessage = new ContactUs({ user_name, email, message });
        const result = await newMessage.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Error creating message.' });
    }
};
//? Remove a contact form submission based on its ID
exports.removeMessage = async (req, res) => {
    const messageId = req.body.messageId;
    console.log(messageId)

    try {
        const result = await ContactUs.findByIdAndDelete(messageId);
        if (!result) {
            res.status(404).json({ message: `Message with ID ${messageId} not found.` });
        } else {
            res.status(200).json({ message: `Message with ID ${messageId} deleted successfully.` });
        }
    } catch (error) {
        console.error(`Error deleting message with ID ${messageId}:`, error);
        res.status(500).json({ message: `Error deleting message with ID ${messageId}.` });
    }
};