const express=require("express")
const router= express.Router()
const multer = require("multer");
const upload = multer();

const assemblyController= require("../Controller/AssemblyController")

router.post("/transcript",upload.single("audio"),assemblyController.getAssembly)

module.exports=router