const asyncHandler = require("../middlewares/asyncHandler.middleware.js");
const Bootcamp = require("../models/bootcamp.model.js");
const ErrorResponse = require("../utils/errorREsponse.utils.js");

exports.getAllBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`unable to get the bootamps by provided id `, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body); // Use 'bootcamp' instead of 'movie'
  res.status(201).json({
    status: "SUCCESS",
    data: {
      bootcamp, // Return 'bootcamp' data in response
    },
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`unable to get the bootamps by provided id `, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`unable to get the bootamps by provided id `, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
