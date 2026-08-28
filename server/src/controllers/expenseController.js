const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const createExpense = async (req, res, next) => {
  try {
    const {
      amount,
      category,
      description,
      date
    } = req.body;

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    if (
      typeof category !== "string" ||
      category.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must contain at least 2 characters"
      });
    }

    if (category.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category cannot exceed 50 characters"
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string"
      });
    }

    if (
      description &&
      description.trim().length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 200 characters"
      });
    }

    if (!date || Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid date is required"
      });
    }

    const expense = await Expense.create({
      amount: numericAmount,
      category: category.trim(),
      description: description?.trim(),
      date
    });

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense
      .find()
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID"
      });
    }

    const {
      amount,
      category,
      description,
      date
    } = req.body;

    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    if (
      typeof category !== "string" ||
      category.trim().length < 2
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must contain at least 2 characters"
      });
    }

    if (category.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Category cannot exceed 50 characters"
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Description must be a string"
      });
    }

    if (
      description &&
      description.trim().length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 200 characters"
      });
    }

    if (!date || Number.isNaN(new Date(date).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid date is required"
      });
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      {
        amount: numericAmount,
        category: category.trim(),
        description: description?.trim(),
        date
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense
    });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID"
      });
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense
};