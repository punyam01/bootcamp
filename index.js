require('dotenv').config()
const { connectDb} = require( './db/index.db.js')
const {app} = require ("./app.js")

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`SERVER IS RUNNING AT PORT:  ${process.env.PORT} `)
    })
  })
  .catch(err => {
    console.log(`DATABASE CONNECTION FAILED :`, err)
  })


