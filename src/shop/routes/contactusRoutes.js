const { Router } = require("express");
const {
  createMessage,
  getAllContacts,
  removeMessage,
  getAllContactsCount,
} = require("../controllers/contactUsController");
const multer = require("multer");

const upload = multer();

//! Create a new router instance
const contactusRouter = Router();

//! Route to create a new contact form submission
contactusRouter.post("/", upload.none(), createMessage);

//! Route to get all contact form submissions
contactusRouter.get("/", getAllContacts);

//! Route to delete a contact form submission by ID
contactusRouter.delete("/:messageId", removeMessage);

contactusRouter.get("/count", getAllContactsCount);
//! Export the router instance
module.exports = contactusRouter;
