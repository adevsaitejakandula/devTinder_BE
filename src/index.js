const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { connectDB } = require("./config/database.js");
const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(cors({
  "origin": "http://localhost:5174",
    "credentials": true
}))
require('dotenv').config()
const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require('./routes/user.js')

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDB()
  .then(() => {
    console.log("Database connection established successfully")
    app.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`)
    });
  })
  .catch((err) => {
    console.log("Failed to connect db " + err.message)
  });