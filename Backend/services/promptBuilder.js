function buildPrompt(mode, query, language) {
  const templates = {
    assistant: `You are CivicAI, an Indian government assistant. Answer in ${language}.
User question: "${query}"
Respond ONLY in this exact JSON format, no markdown, no extra text:
{
  "documents": ["..."],
  "whereToApply": "...",
  "fees": "...",
  "timeline": "...",
  "officialLinks": ["..."]
}`,

    scheme: `You are a government scheme advisor for India. Answer in ${language}.
User profile: ${JSON.stringify(query)}
Recommend 3-5 relevant Indian government schemes. Respond ONLY in this JSON format:
{
  "schemes": [
    {"name": "...", "why": "...", "benefit": "...", "howToApply": "..."}
  ]
}`,

    complaint: `Convert this citizen complaint into a formal government complaint. Answer in ${language}.
Raw complaint: "${query}"
Respond ONLY in this JSON format:
{
  "formalComplaint": "...",
  "department": "...",
  "category": "...",
  "priority": "Low|Medium|High",
  "estimatedResolution": "..."
}`,

    document: `You are a document assistant for Indian government services. Answer in ${language}.
User wants: "${query}"
Respond ONLY in this JSON format:
{
  "documents": ["..."],
  "eligibility": "...",
  "fees": "...",
  "processingTime": "...",
  "commonMistakes": ["..."]
}`,

    summarize: `You are a government notice summarizer. Answer in ${language}.
Notice text: "${query}"
Respond ONLY in this JSON format:
{
  "summary": "...",
  "keyPoints": ["..."],
  "actionRequired": "...",
  "deadline": "..."
}`,
  };

  return templates[mode] || null;
}

module.exports = { buildPrompt };
