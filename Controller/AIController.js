
require("dotenv").config()
const messageModel= require("../models/message")
const feedbackModel= require("../models/feedback")

const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const msgConversation=async(req,res) =>{
    const {transcription}=req.body;
    const {uuid}=req.body;
    if(!transcription)
        return res.status(400).json({message:"Transcription is required"});

    try{
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are Rahul Mehta, a mid-30s man whose phone was stolen. You are stressed and need a SIM replacement. Keep responses short and conversational
    Store executive said: ${transcription}`
  });

  const newMessage=new messageModel({
    message:transcription,
    uuid:uuid,
    user:"Store Executive"
    })
    await newMessage.save();

    const aiMessage=new messageModel({
    message:result.text,
    uuid:uuid,
    user:"Rahul Mehta"
    })
    await aiMessage.save();
   
   
  res.json({message:result.text});

}
catch(err)
{
    res.status(500).json({message:err.message});
}
}


const feedbackController= async(req,res)=>{
    try{
        const {uuid}= req.body;
        const sessionMessages= await messageModel.find({uuid:uuid}).sort({createdAt:1});
        console.log("Session messages:", sessionMessages);

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are Rahul Mehta, a mid-30s man whose phone was stolen. You are stressed and need a SIM replacement. Here are the messages from your conversation with the store executive:
            ${sessionMessages.map(msg => `${msg.user}: ${msg.message}`).join("\n")}
            Return ONLY a JSON object with keys: communication, professionalism, resolution, knowledge and a feedback String(message). Each key should have a rating from 1 to 10 based on the store executive's performance in that area.`
          });


          let raw = result.text.trim().replace(/```json/g, "").replace(/```/g, "");
      
        const feedbackData = JSON.parse(raw);

            const newFeedback = new feedbackModel({
                uuid: uuid,
                feedbackMessage: feedbackData.feedback,
                communication: feedbackData.communication,
                professionalism: feedbackData.professionalism,
                resolution: feedbackData.resolution,
                knowledge: feedbackData.knowledge
            });

            await newFeedback.save();

        res.json({feedback: feedbackData});


    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}

module.exports={
    msgConversation,
    feedbackController
}