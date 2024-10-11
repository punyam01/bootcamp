const asyncHandler = require("../middlewares/asyncHandler.middleware.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const ErrorResponse = require("../utils/errorResponse.utils.js");
const User = require("../models/user.model.js");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessTOken();
    const refreshToken = user.generateRefreshTOken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSAve: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ErrorResponse(
      "Something went wrong while generating tokens",
      500
    );
  }
};

//take data from user
// check for empty data
// check if user exist or not
//  check for images ,check for cover image
// upload them to cloudinary
// create  user object
// remove password and refresh token from response
// check for user creation
// return response

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, userName, email, password } = req.body;

  if (
    [fullName, userName, email, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    return next(new ErrorResponse("All Fields are required", 400));
  }
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) return next(new ErrorResponse("user already existed", 409));

  const avatarLocal = req.files?.avatar[0]?.path;

  // Safely access the cover image file path
  const coverImageLocal = req.files?.coverImage
    ? req.files.coverImage[0]?.path
    : undefined;

  if (!avatarLocal)
    return next(new ErrorResponse("avatar file is required", 400));

  const avatar = await uploadOnCloudinary(avatarLocal);
  const coverImage = await uploadOnCloudinary(coverImageLocal);

  if (!avatar) return next(new ErrorResponse("avatar file is required", 400));

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
    role,
  });
  const createdUSer = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUSer)
    return next(
      new ErrorResponse("something went wrong in creating user", 500)
    );
  res.status(201).json({
    success: true,
    data: createdUSer,
  });
});

exports.logInUser = asyncHandler(async (req, res, next) => {
  // todo list
  // req body -> data
  //  check user exist for username or email
  // find the user
  // password check
  // access and refresh tokens
  // send cookies
  const { email, userName, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse("username or email is required", 400));

  const user = await User.findOne({ $or: [{ userName }, { email }] });

  if (!user) return next(new ErrorResponse("user does not exist ", 404));

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid)
    return next(
      new ErrorResponse("usewr not found with provided credentials", 404)
    );

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      data: user,
      message: "user logged in successfully",
    });
});

exports.logOutUser = asyncHandler(async (req, res, next) => {
  console.log("jii");
  
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      data: {},
      message: "user loggedout successfully",
    });
});
