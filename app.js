const express = require ("express")
const errorHandler = require("./middlewares/error.middleware.js")
const app = express()



// bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory

// router setting 
const bootcamp = require("./routes/bootcamp.routes.js")
const course= require("./routes/course.routes.js")
app.use('/api/v1/bootcamps', bootcamp)
app.use('/api/v1/courses',course)
//error middleware
app.use(errorHandler)


module.exports = { app }


