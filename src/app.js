const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const registering_router = require("./registeration/routes/registeringRoutes");
const admin_routes = require("./admin/routes/adminRoutes");
const upload_Routes = require("./admin/routes/imageRouter");
require("dotenv").config();

const path = require("path");
const productRouts = require("./shop/routes/productsRoutes");
const categoriesRoutes = require("./shop/routes/productsCategoriesRoutes");
const session = require("express-session");
const cartRouts = require("./shop/routes/cartRouts");
const orderRoutes = require("./shop/routes/ordersRoutes");
const commenstRoutes = require("./comments/routes/commentsRouts");
const contactusRouter = require("./shop/routes/contactusRoutes");
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.7:5173",
      "http://localhost:4173",
    ],
    methods: ["POST", "PUT", "GET", "DELETE","OPTIONS", "HEAD"],
    credentials: true,
  })
);
// app.use(
//   session({
//     secret: process.env.SESSION_KEY,
//     name: "cart",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       sameSite: "none",
//       httpOnly: true,
//       secure: false,
//     },
//   })
// );
//! Routers
app.use("/reg", registering_router);
app.use("/reg", admin_routes);

app.use("/admin", upload_Routes);

app.use("/products", productRouts);

app.use("/categories", categoriesRoutes);

app.use("/order", orderRoutes);

app.use("/comments", commenstRoutes);
app.use("/contact", contactusRouter);
// //! cart session handling ...
// app.use("/cart", cartRouts);

//! Allowing access for images only those folders ...FD
app.use(
  "/uploads/thumbnails",
  express.static(path.join(__dirname, "uploads", "thumbnails"))
);

app.use(
  "/uploads/original",
  express.static(path.join(__dirname, "uploads", "original"))
);

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");

    const port = process.env.PORT || 3000;
    app.listen(port, "192.168.1.7", () => {
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
