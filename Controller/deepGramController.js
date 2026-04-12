
require("dotenv").config();

const { createClient } = require("@deepgram/sdk");
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const getDeepGramToken= async (req, res) => {
  try {
    
    const { result, error } = await deepgram.manage.createProjectKey(process.env.DEEPGRAM_PROJECT_ID, {
      comment: "Temporary browser token",
      scopes: ["usage:write"],
      time_to_live_in_seconds: 60,
    });
    
    if (error) throw error;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate token" });
  }
}

module.exports={
    getDeepGramToken
}