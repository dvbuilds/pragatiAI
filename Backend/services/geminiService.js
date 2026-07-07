require("dotenv").config();

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

async function askGemini(prompt) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    }),
  });

  const data = await res.json();

  if (!data.choices) {
    console.error("Groq API error response:", JSON.stringify(data, null, 2));
    return "No response";
  }

  return data.choices?.[0]?.message?.content || "No response";
}

module.exports = { askGemini };