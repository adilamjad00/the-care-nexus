const geminiService = require('../../services/geminiService');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const EMERGENCY_KEYWORDS = [
  'chest pain',
  "can't breathe",
  'unconscious',
  'stroke',
  'heart attack',
  'سینے میں درد',
  'سانس نہیں',
];

/**
 * @desc    Chat with Gemini AI
 * @route   POST /api/ai/gemini/chat
 * @access  Private (Patient-Only Security enforced by Routes)
 */
exports.chat = asyncHandler(async (req, res) => {
  const { message, conversationHistory } = req.body;

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, 'Message is required');
  }

  // Emergency Safety Guardrail
  const isEmergency = EMERGENCY_KEYWORDS.some((k) =>
    message.toLowerCase().includes(k.toLowerCase()),
  );
  if (isEmergency) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          reply:
            '🚨 **This sounds like a medical emergency.** Please call emergency services (1122 in Pakistan) immediately or go to the nearest emergency room. Do not wait.',
          isEmergency: true,
        },
        'Emergency response triggered',
      ),
    );
  }

  try {
    const reply = await geminiService.chat(message, conversationHistory || []);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reply, isEmergency: false },
          'AI response generated successfully',
        ),
      );
  } catch (error) {
    console.error('Gemini AI Chat Error:', error);
    throw new ApiError(500, error.message || 'Failed to process AI request');
  }
});

/**
 * @desc    Get health advice from Gemini
 * @route   POST /api/ai/gemini/health-advice
 * @access  Private (Patient)
 */
exports.getHealthAdvice = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim().length === 0) {
    throw new ApiError(400, 'Query is required');
  }

  try {
    const advice = await geminiService.getHealthAdvice(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { advice },
          'Health advice generated successfully',
        ),
      );
  } catch (error) {
    throw new ApiError(500, error.message || 'Failed to get health advice');
  }
});
