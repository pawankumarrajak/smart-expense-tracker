const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only JPG, PNG and WebP images are allowed."
        )
      );
    }

    cb(null, true);
  }
});

const uploadProfilePicture = upload.single("profilePicture");

module.exports = {
  uploadProfilePicture
};