const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse.utils");
const asyncHandler = require("./asyncHandler.middleware");
const jwt = require("jsonwebtoken");

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      console.log("Token:", token);
    if (!token) {
        return next(new ErrorResponse("Unauthorized request", 401));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  console.log(decodedToken);
  
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return  next(new (ErrorResponse("Invalid access token", 401)));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorResponse(error.message || "Invalid access token", 401)
    );
  }
});

module.exports = verifyJwt;