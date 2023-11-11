const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const registering_router = require("./registeration/routes/registering_routes");
const admin_routes = require("./admin/routes/admin_routes");
require('dotenv').config();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Routers
app.use("/reg", registering_router);
app.use("/reg", admin_routes);


// Connect to the database
mongoose
    .connect("mongodb://127.0.0.1:27017/ShopyDB", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to the database");


        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to the database:", error);
        process.exit(1); // Exit the process if there's an error connecting to the database
    });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});
