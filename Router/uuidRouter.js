const express=require("express")
const router= express.Router()

const uuidController= require("../Controller/uuidCreateController")

router.get("/uuid",uuidController.createUuid)

module.exports=router