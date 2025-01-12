const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { cors, corsOptions } = require("./middleware/cors");
const path = require("path");
const fs = require("fs");
const csrf = require("csurf");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");

dotenv.config();
connectDB();

const app = express();
const csrfProtection = csrf({ cookie: true });

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.url}`
  );
  next();
});

// Routes
const authRoute = require("./routes/authRoutes");
const shippingRoute = require("./routes/shippingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const catalogRoute = require("./routes/catalogRoutes");
const productRoute = require("./routes/productRoutes");
const shopRoutes = require("./routes/shopRoutes");
const siteRoutes = require("./routes/siteRoute");
const chatRoute = require("./routes/chatRoutes");
const userRoute = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const shipingRoutes = require("./routes/shippingRoute");

app.use("/api", authRoute);
app.use("/api", shippingRoute);
app.use("/api", categoryRoutes);
app.use("/api", catalogRoute);
app.use("/api", productRoute);
app.use("/api", shopRoutes);
app.use("/api/v1", siteRoutes);
app.use("/api/v1", chatRoute);
app.use("/api/", userRoute);
app.use("/api/", employeeRoutes);
app.use("/api/", shipingRoutes);

// Socket.IO Setup
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.set("socketio", io);

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/profile", express.static(path.join(__dirname, "profile")));
app.use(
  "/media/uploads",
  express.static(path.join(__dirname, "media/uploads"))
);
app.use("/media/video", express.static(path.join(__dirname, "media/video")));

// CSRF Protection
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

// Upload Directory Setup
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Error Handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: "An error occurred", error: err.message });
});

// Base Route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
