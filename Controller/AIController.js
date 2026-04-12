require("dotenv").config();
const messageModel = require("../models/message");
const feedbackModel = require("../models/feedback");

const Anthropic = require("@anthropic-ai/sdk");

const ai = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const msgConversation = async (req, res) => {
  const { transcription } = req.body;
  const { uuid } = req.body;
  if (!transcription)
    return res.status(400).json({ message: "Transcription is required" });

  try {
    const result = await ai.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 120,
      messages: [
        {
          role: "user",
          content: `
        You are Rahul Mehta, a mid-30s man whose phone was stolen. You are stressed and need a SIM replacement urgently.
        
        RULES:
        - Always respond as Rahul Mehta, never break character.
        - respond short and precise reply
        - No asterisks *
        - No brackets ()
        - No narration
        - No emojis

        Store executive said:
        ${transcription}
        `,
        },
      ],
    });

    let AIReply = result.content[0].text.replace(/[*()]/g, "").trim();

    const newMessage = new messageModel({
      message: transcription,
      uuid: uuid,
      user: "Store Executive",
    });
    await newMessage.save();

    const aiMessage = new messageModel({
      message: AIReply,
      uuid: uuid,
      user: "Rahul Mehta",
    });
    await aiMessage.save();

    res.json({ message: AIReply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const feedbackController = async (req, res) => {
  try {
    const { uuid } = req.body;
    const sessionMessages = await messageModel
      .find({ uuid: uuid })
      .sort({ createdAt: 1 });

   if(sessionMessages.length === 0) {
    return res.status(404).json({ message: "No conversation found for this session." });
    }

    console.log("Session messages:", sessionMessages);

    const chatHistory = sessionMessages
      .map((msg) => `${msg.user}: ${msg.message}`)
      .join("\n");

    const result = await ai.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `

You are Rahul Mehta, a mid-30s man whose phone was stolen. You are stressed and need a SIM replacement
 Here are the messages from your conversation with the store executive-
Conversation:
${chatHistory}

Return ONLY valid JSON:

{
  "communication": number,
  "professionalism": number,
  "resolution": number,
  "knowledge": number,
  "feedback": "short paragraph"
}

Scores from 1 to 10 based on the store executive's performance in that area.
Feeback should not contain any special characters like * or () or emojis and should be short and precise.

`,
        },
      ],
    });

    let rawText = result.content[0].text
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "");

    const feedbackData = JSON.parse(rawText);

    const newFeedback = new feedbackModel({
      uuid: uuid,
      feedbackMessage: feedbackData.feedback,
      communication: feedbackData.communication,
      professionalism: feedbackData.professionalism,
      resolution: feedbackData.resolution,
      knowledge: feedbackData.knowledge,
    });

    await newFeedback.save();

    res.json({ feedback: feedbackData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  msgConversation,
  feedbackController,
};
