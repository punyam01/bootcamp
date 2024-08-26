const express = require ("express")
const app = express()



// bodyparser
app.use(express.json());

// router setting 
const bootcamp = require("./routes/bootcamp.routes.js")
app.use('/api/v1/bootcamps', bootcamp)




module.exports = { app }


