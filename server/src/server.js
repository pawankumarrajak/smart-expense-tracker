const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

/*
 * Security Headers
 */
app.use(helmet());

/*
 * CORS
 */
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

/*
 * Request Body Limit
 */
app.use(express.json({ limit: "10kb" }));

/*
 * Rate Limiting
 */

// Authentication rate limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later."
  }
});

// Currency API rate limit
const currencyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many currency requests. Please try again later."
  }
});

/*
 * API Routes
 */
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/currency", currencyLimiter, currencyRoutes);
app.use("/api/expenses", expenseRoutes);

/*
 * Health Check
 */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Expense Tracker API is running"
  });
});

/*
 * Centralized Error Handler
 */
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/*
 * Database Connection
 */
connectDB();

/*
 * Start Server
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});