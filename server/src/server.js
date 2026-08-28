const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const errorHandler = require("./middleware/errorHandler");

const app = express();

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

app.use(express.json());

/*
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/currency", currencyRoutes);
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