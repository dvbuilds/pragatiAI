const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function askGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}

// ONE endpoint, mode-driven
app.post("/api/ask", async (req, res) => {
  const { mode, query, language = "English" } = req.body;

  let prompt = "";

  if (mode === "assistant") {
    prompt = `You are CivicAI, an Indian government assistant. Answer in ${language}.
User question: "${query}"
Respond ONLY in this exact JSON format, no markdown, no extra text:
{
  "documents": ["..."],
  "whereToApply": "...",
  "fees": "...",
  "timeline": "...",
  "officialLinks": ["..."]
}`;
  }

  if (mode === "scheme") {
    prompt = `You are a government scheme advisor for India. Answer in ${language}.
User profile: ${JSON.stringify(query)}
Recommend 3-5 relevant Indian government schemes. Respond ONLY in this JSON format:
{
  "schemes": [
    {"name": "...", "why": "...", "benefit": "...", "howToApply": "..."}
  ]
}`;
  }

  if (mode === "complaint") {
    prompt = `Convert this citizen complaint into a formal government complaint. Answer in ${language}.
Raw complaint: "${query}"
Respond ONLY in this JSON format:
{
  "formalComplaint": "...",
  "department": "...",
  "category": "...",
  "priority": "Low|Medium|High",
  "estimatedResolution": "..."
}`;
  }

  if (mode === "document") {
    prompt = `You are a document assistant for Indian government services. Answer in ${language}.
User wants: "${query}"
Respond ONLY in this JSON format:
{
  "documents": ["..."],
  "eligibility": "...",
  "fees": "...",
  "processingTime": "...",
  "commonMistakes": ["..."]
}`;
  }

  try {
    const raw = await askGemini(prompt);
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to get response", raw: e.message });
  }
});

app.listen(5000, () => console.log("CivicAI server on :5000"));