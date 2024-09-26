const asyncHandler = require("../middlewares/asyncHandler.middleware.js");
const Course = require("../models/course.model.js");
const ErrorResponse = require("../utils/errorREsponse.utils.js");
const Bootcamp = require("../models/bootcamp.model.js");

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// getting the xourse by id

exports.getCourseById = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description ",
  });

  if (!course) {
    return next(
      new ErrorResponse(
        `no course found with the given id ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// updating the course

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `no course found with the given id ${req.params.id}`,
        404
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  course = await query;
  res.status(200).json({
    success: true,
    data: course,
  });
});

// deletion

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(
        `no course found with the given id ${req.params.id}`,
        404
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// adding a course
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `no bootamp found with the given id ${req.params.bootcampId}`,
        404
      )
    );
  }

  const course = await Course.create(req.body);

  
  res.status(200).json({
    success: true,
    data: course,
  });
});
