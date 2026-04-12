const express=require("express")
const router= express.Router()

const AIController= require("../Controller/AIController")

router.post("/chat",AIController.msgConversation)
router.post("/feedback",AIController.feedbackController)



module.exports=router