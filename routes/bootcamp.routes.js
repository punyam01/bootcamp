const express = require("express");
const {
  getAllBootcamp,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
} = require("../controllers/bootcamp.controller.js");

const router = express.Router();


router.route('/')
.get(getAllBootcamp)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.delete(deleteBootcamp)
.put(updateBootcamp);

module.exports = router;
