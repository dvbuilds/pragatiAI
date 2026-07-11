const { askGemini } = require("../services/geminiService");
const { buildPrompt } = require("../services/promptBuilder");

async function handleAsk(req, res) {
  const { mode, query, language = "English" } = req.body;

  const prompt = buildPrompt(mode, query, language);
  if (!prompt) {
    return res.status(400).json({ error: "Invalid mode" });
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
}

module.exports = { handleAsk };
