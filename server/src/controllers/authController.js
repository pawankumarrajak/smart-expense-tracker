const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      const error = new Error(
        "Name, email and password are required"
      );

      error.statusCode = 400;
      return next(error);
    }

    // Validate name
    if (
      typeof name !== "string" ||
      name.trim().length < 2
    ) {
      const error = new Error(
        "Name must contain at least 2 characters"
      );

      error.statusCode = 400;
      return next(error);
    }

    if (name.trim().length > 50) {
      const error = new Error(
        "Name cannot exceed 50 characters"
      );

      error.statusCode = 400;
      return next(error);
    }

    // Validate email
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      const error = new Error(
        "Please provide a valid email address"
      );

      error.statusCode = 400;
      return next(error);
    }

    // Validate password
    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      const error = new Error(
        "Password must contain at least 8 characters"
      );

      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      const error = new Error(
        "An account with this email already exists"
      );

      error.statusCode = 409;
      return next(error);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    // Never return password
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser
};