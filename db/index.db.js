const mongoose = require("mongoose")

const connectDb = async () => {
    try {
      const connectionInstance = await mongoose.connect(
        `${process.env.DB_URL}/${process.env.DB_NAME}`
      )
      console.log(
        `DATABASE CONNECTION SUCCESSFULL DB HOST : ${connectionInstance.connection.host}`
      )
    } catch (error) {
      console.log(`DATABASE CONNECTION FAILED!!:`, error)
    }
  }
  
  module.exports = {connectDb}