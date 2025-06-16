const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const genAI = new GoogleGenerativeAI("AIzaSyAOaM4w4LCzGELsLO4Vh4nXIs0HhoEQMLw");

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const generationConfig = {
      temperature: 0.2,  
      topK: 1,
      topP: 0.8,
    };
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig
    });

    const chat = model.startChat({
      history: [],
      generationConfig,
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are a professional fitness assistant. ONLY answer questions related to fitness, workouts, nutrition, and health. For ANY questions outside of these topics, respond ONLY with: 'Aku hanya bisa menjawab pertanyaan terkait GYM dan WORKOUT ya teman-teman.'" }]
      }
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    
    res.json({ text: response.text() });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process your request" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});