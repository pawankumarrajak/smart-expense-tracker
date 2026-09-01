const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "name email isEmailVerified profilePicture createdAt updatedAt"
    );

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, removeProfilePicture } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    if (name !== undefined) {
      if (typeof name !== "string") {
        const error = new Error("Name must be a valid string");
        error.statusCode = 400;
        return next(error);
      }

      const normalizedName = name
        .trim()
        .replace(/\s+/g, " ");

      if (normalizedName.length < 2) {
        const error = new Error(
          "Name must contain at least 2 characters"
        );
        error.statusCode = 400;
        return next(error);
      }

      if (normalizedName.length > 50) {
        const error = new Error(
          "Name cannot exceed 50 characters"
        );
        error.statusCode = 400;
        return next(error);
      }

      user.name = normalizedName;
    }

    if (
    removeProfilePicture === "true" &&
    !req.file
    ) {
    user.profilePicture = null;
    }

    if (req.file) {
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "smart-expense-tracker/profile-pictures",
              resource_type: "image"
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }

              resolve(result);
            }
          );

          stream.end(req.file.buffer);
        });
      };

      const uploadResult = await uploadFromBuffer();

      if (!uploadResult?.secure_url) {
        const error = new Error(
          "Failed to upload profile picture."
        );
        error.statusCode = 503;
        return next(error);
      }

      user.profilePicture = uploadResult.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};