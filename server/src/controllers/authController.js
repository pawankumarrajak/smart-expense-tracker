const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const {
  sendVerificationEmail
} = require("../services/emailService");


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
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
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

    const normalizedEmail =
      email.trim().toLowerCase();

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

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const verificationExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    const verificationUrl =
      `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail(
        user.email,
        user.name,
        verificationUrl
      );
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);

      const error = new Error(
        "Unable to send verification email. Please try again."
      );
      error.statusCode = 503;
      return next(error);
    }

    res.status(201).json({
      success: true,
      message:
        "Account created. Please check your email to verify your account.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};


const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (
      typeof token !== "string" ||
      !token.trim()
    ) {
      const error = new Error(
        "Verification token is required"
      );
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({
      emailVerificationToken: token.trim(),
      emailVerificationExpires: {
        $gt: new Date()
      }
    }).select(
      "+emailVerificationToken +emailVerificationExpires"
    );

    if (!user) {
      const error = new Error(
        "Invalid or expired verification link."
      );
      error.statusCode = 400;
      return next(error);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Email verified successfully. You can now login."
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
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
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

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    }).select(
      "+password +emailVerificationToken +emailVerificationExpires"
    );

    if (!user) {
      const error = new Error(
        "Invalid email or password"
      );
      error.statusCode = 401;
      return next(error);
    }

    const isPasswordValid =
      await bcrypt.compare(
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

    if (!user.isEmailVerified) {
      const error = new Error(
        "Please verify your email before logging in."
      );
      error.statusCode = 403;
      return next(error);
    }

    const token = generateToken(
      user._id.toString()
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      }
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registerUser,
  verifyEmail,
  loginUser
};
