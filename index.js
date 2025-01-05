const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { cors, corsOptions } = require("./middleware/cors");
const path = require("path");
const fs = require("fs");
const csrf = require("csurf");

const cookieParser = require("cookie-parser");

const csrfProtection = csrf({ cookie: true });

dotenv.config();
connectDB();

const app = express();

// Use the imported corsOptions
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Logging middleware to log every request
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`[${new Date().toISOString()}] ${method} request to ${url}`);
  next();
});

const authRoute = require("./routes/authRoutes");
app.use("/api", authRoute);

const shippingRoute = require("./routes/shippingRoutes");
app.use("/api", shippingRoute);

const caetgoryRoutes = require("./routes/categoryRoutes");
app.use("/api", caetgoryRoutes);

const catalogRoute = require("./routes/catalogRoutes");
app.use("/api", catalogRoute);

const productRoute = require("./routes/productRoutes");
app.use("/api", productRoute);

const shopRoutes = require("./routes/shopRoutes");
app.use("/api", shopRoutes);

const siteRoutes = require("./routes/siteRoute");
app.use("/api/v1", siteRoutes);

const chatRoute = require("./routes/chatRoutes");
app.use("/api/v1", chatRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/media/uploads",
  express.static(path.join(__dirname, "media/uploads"))
);

app.use("/media/video", express.static(path.join(__dirname, "media/video")));

app.use(csrfProtection);
app.get("/csrf-token", (req, res) => {
  const csrfToken = req.csrfToken();

  res.cookie("_csrf", csrfToken, {
    httpOnly: false,
    secure: false,
    sameSite: "Lax",
    expires: new Date(Date.now() + 604800000),
  });
  res.status(200).json({ message: "CSRF token set in header and cookie" });
});

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: "An error occurred", error: err.message });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
