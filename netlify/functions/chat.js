const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    console.log('Function triggered with event:', JSON.stringify(event, null, 2));
    
    const { message } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Message is required" })
      };
    }

    console.log('Processing message:', message);

    // For testing, return a simple response first
    if (message.toLowerCase().includes('test')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          text: "Test successful! Netlify Functions are working. Your message was: " + message 
        })
      };
    }

    // Get API key from environment variable, with fallback
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "API key not configured",
          details: "Please set GOOGLE_AI_API_KEY environment variable" 
        })
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

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
    const responseText = response.text();
    
    console.log('AI Response:', responseText);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: responseText })
    };
  } catch (error) {
    console.error("Error in function:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Failed to process your request",
        details: error.message 
      })
    };
  }
}; 