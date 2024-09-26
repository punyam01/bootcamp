const express = require("express");
const { getCourses,updateCourse,deleteCourse,getCourseById ,addCourse} = require("../controllers/course.controller.js");

const router = express.Router({mergeParams:true});

router.route('/')
.get(getCourses)
.post(addCourse)

router.route('/:id')
.put(updateCourse)
.delete(deleteCourse)
.get(getCourseById)


module.exports = router;
