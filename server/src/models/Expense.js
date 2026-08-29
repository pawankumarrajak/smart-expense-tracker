const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
      validate: {
        validator: Number.isFinite,
        message: "Amount must be a valid number"
      }
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must contain at least 2 characters"],
      maxlength: [50, "Category cannot exceed 50 characters"],
      set: (value) => {
        const normalized = value.trim().toLowerCase();

        return (
          normalized.charAt(0).toUpperCase() +
          normalized.slice(1)
        );
      }
    },

    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"]
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: (value) => !Number.isNaN(value.getTime()),
        message: "Date must be valid"
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Expense", expenseSchema);