const express = require("express");
const {
  getAllBootcamp,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
} = require("../controllers/bootcamp.controller.js");

const router = express.Router();
// hi there 

router.route('/')
.get(getAllBootcamp)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.delete(deleteBootcamp)
.put(updateBootcamp);

module.exports = router;
