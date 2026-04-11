const express= require("express")
const app= express()
const cors= require("cors")
//const mongoose= require("mongoose")
require("dotenv").config()
const port= 4000
const path= require("path")


app.use(express.json())
app.use(cors())
app.use(express.static("public"))
//app.use(express.static(path.join(__dirname, "./view")));


app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"./view/screen/home.html"))
})


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});





