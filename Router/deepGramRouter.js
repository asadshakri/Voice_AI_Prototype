const express=require("express")
const router= express.Router()

const deepGramController= require("../Controller/deepGramController")

router.get("/deepGram",deepGramController.getDeepGramToken)

module.exports=router