const ErrorResponse = require("../utils/errorResponse.utils");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
 error.message = err.message
 
  // wrong id provided
  if (err.name == "CastError") {
    const message = `Bootcamp not found with id of ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  
  // mongoose Duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name == "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server error ",
  });
};
module.exports = errorHandler;
