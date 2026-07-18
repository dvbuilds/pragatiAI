import OpenAI from 'openai';

const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
const MODEL = 'llama-3.1-8b-instant';

// Strips markdown code fences some models wrap JSON in, then parses.
//
// Small/fast models (llama-3.1-8b-instant especially) frequently emit
// literal newlines inside JSON string values (e.g. a multi-line email
// body) instead of escaping them as \n — which is invalid JSON and makes
// JSON.parse throw "Bad control character in string literal...". We try a
// plain parse first, and only if that fails, walk the string and escape
// any raw control character that appears *inside* a JSON string literal,
// leaving the JSON structure itself untouched, then retry.
const escapeControlCharsInStrings = (raw) => {
  let out = '';
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (escapeNext) {
      out += ch;
      escapeNext = false;
      continue;
    }
    if (ch === '\\') {
      out += ch;
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString && (ch === '\n' || ch === '\r' || ch === '\t')) {
      out += ch === '\n' ? '\\n' : ch === '\r' ? '\\r' : '\\t';
      continue;
    }
    out += ch;
  }
  return out;
};

const parseJson = (text) => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return JSON.parse(escapeControlCharsInStrings(cleaned));
  }
};

// Small helper so every call site doesn't repeat the chat.completions shape.
const askGroq = async (prompt, { systemInstruction } = {}) => {
  const messages = [];
  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }
  messages.push({ role: 'user', content: prompt });

  const response = await ai.chat.completions.create({
    model: MODEL,
    messages,
  });

  return response.choices[0].message.content;
};

/**
 * Categorizes a civic issue report (pothole / streetlight / trash / noise / other),
 * assigns a department + priority. Replaces the frontend's mock setTimeout logic
 * with a real model call.
 */
export const categorizeIssue = async (description) => {
  const prompt = `You are the triage system for a civic issue reporting app. Given a citizen's description of a problem, classify it.

Description: "${description}"

Respond with ONLY a JSON object, no markdown, no preamble, in this exact shape:
{
  "category": "pothole" | "lighting" | "sanitation" | "noise" | "other",
  "department": "<the specific municipal department responsible>",
  "priority": "Low" | "Medium" | "High",
  "confidence": <number 0-1>,
  "reasoning": "<one sentence explaining the classification>"
}`;

  try {
    const text = await askGroq(prompt);
    return parseJson(text);
  } catch (err) {
    console.error('AI categorization failed, falling back to keyword match:', err.message);
    return keywordFallbackCategorize(description);
  }
};

// Deterministic fallback so the report flow never breaks if the AI call fails.
const keywordFallbackCategorize = (description) => {
  const d = description.toLowerCase();
  if (/(pothole|road|street|pave)/.test(d)) {
    return { category: 'pothole', department: 'Bureau of Streets & Repair', priority: 'High', confidence: 0.4, reasoning: 'Keyword fallback match.' };
  }
  if (/(light|dark|lamp)/.test(d)) {
    return { category: 'lighting', department: 'Department of Electrical Services', priority: 'Medium', confidence: 0.4, reasoning: 'Keyword fallback match.' };
  }
  if (/(trash|bin|garbage|sanitation)/.test(d)) {
    return { category: 'sanitation', department: 'Sanitation & Solid Waste Division', priority: 'Medium', confidence: 0.4, reasoning: 'Keyword fallback match.' };
  }
  if (/(loud|noise|sound|music)/.test(d)) {
    return { category: 'noise', department: 'Code Enforcement & Environmental Health', priority: 'Low', confidence: 0.4, reasoning: 'Keyword fallback match.' };
  }
  return { category: 'other', department: 'Department of Public Works', priority: 'Medium', confidence: 0.3, reasoning: 'Keyword fallback match.' };
};

/**
 * Drafts a formal complaint email about waterlogging, inefficient government
 * service, or crime rate in a given area.
 */
export const generateComplaintEmail = async ({ issueCategory, area, details, citizenName }) => {
  const categoryLabel = {
    waterlogging: 'waterlogging / drainage failure',
    inefficient_service: 'inefficient performance of government officials',
    crime_rate: 'excessive crime rate',
  }[issueCategory];

  const prompt = `Draft a formal, respectful, but firm complaint email from a citizen to the relevant local government authority, about the following civic issue.

Issue type: ${categoryLabel}
Area/locality: ${area}
Citizen's account of the situation: "${details}"
Citizen's name: ${citizenName}

Requirements:
- Professional tone suitable for an official government complaint / grievance portal.
- Reference the specific area and specific details given, don't be generic.
- Include a clear request for action and a reasonable timeline.
- End with the citizen's name as the signature.
- Keep it under 300 words.

Respond with ONLY a JSON object, no markdown fences:
{
  "subject": "<concise formal subject line>",
  "body": "<the full email body including greeting and signature>"
}`;

  const text = await askGroq(prompt);
  return parseJson(text);
};

/**
 * Generates a step-by-step guide for creating/updating a government document,
 * paired with an official application link when we have one on file.
 */
export const generateDocumentGuide = async ({ documentName, action, officialLink }) => {
  const prompt = `You are a helpful assistant guiding an Indian citizen through a government document process.

Document: ${documentName}
Action requested: ${action === 'update' ? 'Update / correct an existing document' : 'Create a new document (first-time application)'}

Provide clear, numbered, practical steps for how to do this, including what documents/proofs are typically required, typical processing time, and any fees if commonly known. Be specific and practical, not generic.

Respond with ONLY a JSON object, no markdown fences:
{
  "documentName": "${documentName}",
  "action": "${action}",
  "steps": ["<step 1>", "<step 2>", "..."],
  "requiredDocuments": ["<doc 1>", "..."],
  "estimatedTime": "<typical processing time>",
  "estimatedFee": "<typical fee, or 'Free' if applicable>",
  "notes": "<any important caveats>"
}`;

  const text = await askGroq(prompt);
  const guide = parseJson(text);
  guide.officialLink = officialLink || guide.officialLink || null;
  return guide;
};

/**
 * Matches a citizen's profile (age, gender, income, category, state) against
 * government welfare schemes, using the seeded scheme list as grounding so the
 * model doesn't hallucinate program names, then explains eligibility + how to apply.
 */
export const matchSchemes = async ({ profile, seedSchemes }) => {
  const prompt = `You are a government scheme eligibility advisor for Indian citizens.

Citizen profile:
- Age: ${profile.age ?? 'not provided'}
- Gender: ${profile.gender ?? 'not provided'}
- Annual household income (INR): ${profile.annualIncome ?? 'not provided'}
- Social category: ${profile.category ?? 'not provided'}
- State: ${profile.state ?? 'not provided'}
- Occupation: ${profile.occupation ?? 'not provided'}

Here is a reference list of real government schemes with their official application links, in JSON:
${JSON.stringify(seedSchemes)}

From this reference list ONLY (do not invent scheme names or links), select the schemes this citizen is likely eligible for, and briefly explain why. If none clearly fit, return the closest 2-3 general-purpose schemes and say eligibility should be confirmed on the portal.

Respond with ONLY a JSON array, no markdown fences:
[
  {
    "name": "<scheme name, must match reference list>",
    "whyEligible": "<one or two sentence explanation tied to their profile>",
    "howToApply": "<short practical process summary>",
    "officialLink": "<link, must match reference list>"
  }
]`;

  const text = await askGroq(prompt);
  return parseJson(text);
};

/**
 * Free-form conversational assistant for the chat UI. Takes the recent message
 * history (sender/text pairs) and returns a reply, grounded with a system
 * instruction describing what CivicPulse AI actually covers so it steers
 * citizens toward the dedicated tools (issue reporting, complaint drafting,
 * document guides, scheme matching) instead of hallucinating specifics.
 */
export const chatWithAssistant = async (history) => {
  const systemInstruction = `You are CivicPulse AI, a municipal citizen assistant embedded in a civic-services app. Answer questions about permits, parking, sanitation schedules, zoning, local taxes, and general civic/government topics concisely and practically. Be upfront when an answer depends on the citizen's specific city/ward and could vary.

The app also has four dedicated tools you should point users toward when relevant, rather than trying to fully complete these tasks yourself in chat:
- Reporting a pothole, broken streetlight, or trash/sanitation issue with a photo and location
- Drafting and sending a formal complaint email about waterlogging, inefficient government service, or crime rate
- Getting step-by-step guidance (with the official link) for creating or updating a government document
- Finding government welfare schemes they're eligible for based on age, gender, and income

Keep replies under 120 words unless the user is asking for a detailed list of steps.`;

  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  ];

  const response = await ai.chat.completions.create({
    model: MODEL,
    messages,
  });

  return response.choices[0].message.content;
};

export default { categorizeIssue, generateComplaintEmail, generateDocumentGuide, matchSchemes, chatWithAssistant };