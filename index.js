
const express=require("express")
const { connection } = require("./connection/db")
const { userRoute } = require("./routes/usersRoutes")
const app=express()
const cors = require("cors")
require("dotenv").config()
app.use(cors())
app.use(express.json())
// app.get("/",(req,res)=>{
//     console.log("home page");
// })

app.use("/",userRoute)

app.listen(7009,async()=>{
    try{
        await connection
        console.log("Server is Connected to Mongoose")
    }catch(err){
        console.log(err)
    }
    console.log(`server is connected to  7009`)
})