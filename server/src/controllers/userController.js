const User = require("../models/User");

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

module.exports = {
  getProfile
};
