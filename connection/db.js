const mongoose=require("mongoose")
require("dotenv").config()

const connection=mongoose.connect("mongodb+srv://hrsusikesh:hrusikesh@cluster0.nyq6r4m.mongodb.net/test")

module.exports={connection}