const express=require("express")
const app= express()
const cors= require("cors")
const mongoose= require("mongoose")
require("dotenv").config()
const port= process.env.PORT
const path= require("path")

const AIRouter= require("./Router/AIRouter")
const uuidRouter= require("./Router/uuidRouter")
app.use(express.json())
app.use(cors())
app.use(express.static("public"))
//app.use(express.static(path.join(__dirname, "./view")));
require("./models/message")

app.use("/api/ai",AIRouter)
app.use("/create",uuidRouter)

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"./view/screen/home.html"))
});

( async() => {
  try {
   await mongoose.connect(process.env.MONGO_URL);
   app.listen(port,()=>{
  console.log(`Server is running on http://localhost:${port}`);
  });
  } catch (err) {
    console.error("Server startup failed:", err);
 }
})();





