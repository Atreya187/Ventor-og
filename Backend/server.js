require('dotenv').config(); // MUST BE AT THE VERY TOP
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const connectDB = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// 1. Initialize Groq with the key from your .env file
// This is now outside the route so it's created only once when the server starts
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/* CONNECT DATABASE */
connectDB();
// origin: "https://ventor-og.vercel.app",
/* MIDDLEWARE */
/* MIDDLEWARE */
app.use(express.json()); // Parse JSON first

// Use an array to allow both your production site and your local testing
// Locate this section in your server.js
app.use(cors({
  origin: 'https://ventor-og-1.onrender.com' 
}));




/* ROUTES */
app.use("/api", reportRoutes);

/* CHAT ROUTE */
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  // Safety check: Ensure the API key was actually loaded
  if (!process.env.GROQ_API_KEY) {
    console.error("ERROR: GROQ_API_KEY is missing from .env file");
    return res.status(500).json({ reply: "Server configuration error." });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for Ventor, a premium startup model planner website."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama-3.1-8b-instant"
    });

    res.json({
      reply: chatCompletion.choices[0].message.content
    });
  } catch (error) {
    // This logs the specific error to your terminal (VS Code) so you can debug
    console.error("Groq API Error Details:", error.response?.data || error.message);
    
    res.status(500).json({
      reply: "The AI is currently unavailable. Please try again later."
    });
  }
});

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("Ventor API is running successfully.");
});

/* START SERVER */
// Use process.env.PORT for deployment, fallback to 5000 for local dev
const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
