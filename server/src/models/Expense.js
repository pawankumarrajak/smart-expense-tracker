const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1, "Amount must be greater than 0"]
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must contain at least 2 characters"]
    },

    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"]
    },

    date: {
      type: Date,
      required: [true, "Date is required"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Expense", expenseSchema);