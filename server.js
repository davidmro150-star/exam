
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Parse incoming JSON
app.use(express.json({ limit: "10kb" }));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// General API rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use("/api", limiter);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CareerConnect API is running",
  });
});

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

