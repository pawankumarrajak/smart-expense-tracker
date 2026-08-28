const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      const error = new Error(
        "Name, email and password are required"
      );
      error.statusCode = 400;
      return next(error);
    }

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

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

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


const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error(
        "Email and password are required"
      );
      error.statusCode = 400;
      return next(error);
    }

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

    if (typeof password !== "string") {
      const error = new Error(
        "Password must be a valid string"
      );
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    }).select("+password");

    if (!user) {
      const error = new Error(
        "Invalid email or password"
      );
      error.statusCode = 401;
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      const error = new Error(
        "Invalid email or password"
      );
      error.statusCode = 401;
      return next(error);
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registerUser,
  loginUser
};