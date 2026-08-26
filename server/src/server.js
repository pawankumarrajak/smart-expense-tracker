const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const expenseRoutes = require("./routes/expenseRoutes");
const currencyRoutes = require("./routes/currencyRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/currency", currencyRoutes);
app.use("/api/expenses", expenseRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Expense Tracker API is running"
  });
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});