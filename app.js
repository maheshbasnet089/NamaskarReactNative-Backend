const express = require('express')
const connectToDB = require("./database")
const app = express()
require("dotenv").config()
connectToDB()
//routes 
app.use(express.json())
const authRoute = require("./routes/authRoute")
const productRoute = require("./routes/productRoute")
const adminRoute = require("./routes/adminRoute")
const consumerRoute = require("./routes/consumerRoute")


app.use("/api",authRoute)
app.use("/api",productRoute)
app.use('/api/admin',adminRoute)
app.use("/api/consumer",consumerRoute)


app.use(express.static("./uploads/"))

app.listen(3000,()=>{
    console.log("Server has started at port 3000")
})