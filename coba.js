const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serve static files from current directory

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyAOaM4w4LCzGELsLO4Vh4nXIs0HhoEQMLw");

// Create API endpoint for chat
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
      model: "gemini-1.5-pro",
      generationConfig,
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_LOW_AND_ABOVE"
        }
      ]
    });

    const chat = model.startChat({
      history: [],
      generationConfig,
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_LOW_AND_ABOVE"
        }
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: "You are a professional fitness assistant. ONLY answer questions related to fitness, workouts, nutrition, and health. For ANY questions outside of these topics, respond ONLY with: 'Aku hanya bisa menjawab pertanyaan terkait GYM dan WORKOUT ya adick-adick. Please be smart.'" }]
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});