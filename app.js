const express = require ("express")
const errorHandler = require("./middlewares/error.middleware.js")
const app = express()



// bodyparser
app.use(express.json());

// router setting 
const bootcamp = require("./routes/bootcamp.routes.js")
app.use('/api/v1/bootcamps', bootcamp)

//error middleware
app.use(errorHandler)


module.exports = { app }


