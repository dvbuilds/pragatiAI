import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { chatWithAssistant } from '../services/ai.service.js';

export const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message?.trim()) throw new ApiError(400, 'message is required');

  // Cap history sent to the model to keep latency/cost bounded; the UI keeps
  // the full transcript, we just don't need all of it for context.
  const trimmedHistory = Array.isArray(history) ? history.slice(-10) : [];
  const fullHistory = [...trimmedHistory, { sender: 'user', text: message }];

  let reply;
  try {
    reply = await chatWithAssistant(fullHistory);
  } catch (err) {
    console.error('Assistant chat failed:', err.message);
    throw new ApiError(502, 'The AI assistant is temporarily unavailable. Please try again in a moment.');
  }

  res.status(200).json(new ApiResponse(200, { reply }, 'Assistant replied'));
});
