const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a course title"],
  },
  description: {
    type: String,
    required: [true, "please add a description of course"],
  },
  weeks: {
    type: String,
    required: [true, "please add the no. of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "please add a tuition cost"],
  },
  minimumSkills: {
    type: String,
    required: [true, "please add the no. of weeks"],
    enum: ["begineer", "intermediate", "advanced"],
  },
  scholarShipAvailiable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp:{
    type:mongoose.Schema.ObjectId,
    ref:'Bootcamp',
    required:true
  }
});
CourseSchema.index({ title: 1, bootcamp: 1 }, { unique: true });
const Course = mongoose.model("Course", CourseSchema);
Course.syncIndexes();
module.exports= Course