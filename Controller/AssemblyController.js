require("dotenv").config();
const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY
});

const transcribeController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const transcript = await client.transcripts.transcribe({
      audio: req.file.buffer,
      speech_models: ["universal"],
      language_code: "en"
    });

    res.json({
      transcript: transcript.text || ""
    });

  } catch (err) {
    console.error("AssemblyAI Error:", err);
    res.status(500).json({ error: "Transcription failed" });
  }
};

module.exports = { getAssembly: transcribeController };