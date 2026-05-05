const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

// Allow your Chrome extension to communicate with this server
app.use(cors());
app.use(express.json());

app.post("/api/summarize", async (req, res) => {
  try {
    const { text } = req.body;

    // Make the request to Groq from the server, NOT the browser
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          // Your API key is safely injected from the environment variables here
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768", // or whichever model you are using
          messages: [
            {
              role: "system",
              content: "You are a helpful summarization assistant.",
            },
            { role: "user", content: `Summarize this: ${text}` },
          ],
        }),
      }
    );

    const data = await response.json();

    // Send the AI's response back to your Chrome extension
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
