const asyncHandler = require("../middlewares/asyncHandler.middleware.js");
const Bootcamp = require("../models/bootcamp.model.js");
const ErrorResponse = require("../utils/errorResponse.utils.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

exports.getAllBootcamp = asyncHandler(async (req, res, next) => {
  let query;
  //copying the req.query
  const reqQuery = { ...req.query };

  //fields to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  //loop over remove fields and delete them from the reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //creating the query string
  let queryStr = JSON.stringify(reqQuery);

  //create operaters ($gt,$gte etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //finding the resource on the certain conditions
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  // selecting certain fields from the database
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields); // Add selected fields to the query
  }

  // Sort the results (if 'sort' parameter is provided in query)
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy); // Sort by specified fields
  } else {
    // Default sorting by creation date in descending order
    query = query.sort("-createdAt");
  }

  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  query = query.skip(startIndex).limit(limit);
  const total = await Bootcamp.countDocuments();

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //executing the query
  const bootcamps = await query;

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
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
  const bootcamp = await Bootcamp.create(req.body);
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
  // Find bootcamp by ID
  let bootcamp = await Bootcamp.findById(req.params.id);

  // If bootcamp not found, return an error response
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Unable to find the bootcamp with ID ${req.params.id}`,
        404
      )
    );
  }

  // Remove the bootcamp and wait for the result
  bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  // Send success response
  res.status(200).json({
    success: true,
    data: {},
  });
});

//  uploading the image
exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  // Find bootcamp by ID
  const bootcamp = await Bootcamp.findById(req.params.id);
  
  // If bootcamp not found, return an error response
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Unable to find the bootcamp with ID ${req.params.id}`,
        404
      )
    );
  }

  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  // Upload the file to Cloudinary
  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
  
  // If upload failed, return an error response
  if (!cloudinaryResponse) {
    return next(new ErrorResponse('Error uploading file to Cloudinary', 500));
  }

  // Optionally, you can update the bootcamp with the Cloudinary URL
  bootcamp.photo = cloudinaryResponse.secure_url; // assuming the Cloudinary response has the secure URL
  await bootcamp.save();

  // Send success response
  res.status(200).json({
    success: true,
    data:bootcamp,
  });
});
