const express = require("express");
const {upload}= require('../middlewares/multer.middleware.js')
const verifyJwt = require ("../middlewares/auth.middleware.js")
const {
  getAllBootcamp,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  uploadPhoto
} = require("../controllers/bootcamp.controller.js");

// include other resources router
const courseRouter= require('./course.routes.js')

const router = express.Router();

// reroute in to other resource routers
router.use('/:bootcampId/courses',courseRouter)


router.route('/')
.get( verifyJwt,getAllBootcamp)
.post( verifyJwt ,createBootcamp);

router.route('/:id')
.get(getBootcamp)
.delete(deleteBootcamp)
.put( upload.single("image"),uploadPhoto,updateBootcamp);


module.exports = router;
