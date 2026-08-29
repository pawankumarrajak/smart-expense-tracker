const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    method: req.method,
    path: req.originalUrl,
    stack: process.env.NODE_ENV === "development"
      ? err.stack
      : undefined
  });

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message
  };

  if (statusCode >= 500 && process.env.NODE_ENV === "development") {
    response.error = err.message;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;