const { Router } = require("express");
const { getAllContacts, removeMessage, createMessage, getAllContactsCount } = require("../controllers/contactus_controller");

//! Create a new router instance
const contactusRouter = Router();

//! Route to create a new contact form submission
contactusRouter.post('/new_message', createMessage);

//! Route to get all contact form submissions
contactusRouter.get('/get', getAllContacts);
contactusRouter.get('/count', getAllContactsCount)

//! Route to delete a contact form submission by ID
contactusRouter.delete('/delete', removeMessage);

//! Export the router instance
module.exports = contactusRouter;