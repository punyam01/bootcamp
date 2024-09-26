const mongoose = require("mongoose");
const slugify = require('slugify');
let course = require('./course.model.js')
const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [500, "Description can not be more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "minimum should be 1"],
    max: [10, "minimum should be 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no- photo.jpeg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
// for reverse populate compulsory twikking
{
  toJSON:{virtuals :true},
  toObject:{virtuals:true}
});

// creating bootcamp slug from the name
BootcampSchema.pre('save',function(next){
this.slug = slugify(this.name,{lower:true})
next()
})
//cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('findOneAndDelete', async function (next) {
  try {
    const bootcampId = this.getQuery()._id;  // Get the bootcamp ID
    console.log(`Deleting courses for bootcamp ${bootcampId}`);
   
   
    
    // Delete associated courses
    const result = await course.deleteMany({ bootcamp: bootcampId });
    console.log(`Deleted ${result.deletedCount} courses associated with bootcamp ${bootcampId}`);

    next();
  } catch (error) {
    console.error(`Error deleting courses: ${error.message}`);
    next(error);  // Pass the error to the next middleware
  }
});
//reverse populate 
BootcampSchema.virtual('courses', {
  ref: 'Course',          // Ensure this matches the model name
  localField: '_id',      // Field in Bootcamp
  foreignField: 'bootcamp', // Field in Course that references Bootcamp
  justOne: false
});
module.exports = mongoose.model('Bootcamp', BootcampSchema);