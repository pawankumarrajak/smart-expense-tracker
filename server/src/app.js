require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Render is behind a reverse proxy.
// Trust the first proxy so express-rate-limit can correctly
// process X-Forwarded-For headers.
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-expense-tracker-41dn.onrender.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Request body limit
app.use(express.json({ limit: "10kb" }));

// Authentication rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again later."
  }
});

// Currency API rate limiter
const currencyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many currency requests. Please try again later."
  }
});

// API routes
app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/currency", currencyLimiter, currencyRoutes);

app.use("/api/expenses", expenseRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Expense Tracker API is running"
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;