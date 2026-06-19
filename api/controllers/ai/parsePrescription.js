const axios = require('axios');
const asyncHandler = require('../../utils/asyncHandler');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const PARSE_PROMPT = `You are a medical prescription parser for a Pakistani healthcare platform (The Care Nexus).
Doctors dictate prescriptions verbally in English, Urdu, or a mix of both.

Return ONLY valid JSON — no markdown, no explanation, no preamble. Exactly this shape:
{
  "diagnosis": "string or null",
  "medicines": [
    {
      "name": "string",
      "dosage": "string",
      "frequency": "string",
      "duration": "string"
    }
  ],
  "notes": "string or null",
  "consultationFee": number or null,
  "medicineCost": number or null
}

Rules:
- Medicine names always in English regardless of transcript language
- Frequency: normalize to English ("twice daily", "three times a day", "at night", "as needed")
- Duration: normalize to English ("5 days", "1 week", "continue until review")
- If the transcript contains no medical content (greetings, test phrases, random speech, gibberish), return exactly:
  { "error": "not_a_prescription", "diagnosis": null, "medicines": [], "notes": null, "consultationFee": null, "medicineCost": null }
- Never invent data not present in the transcript
- consultationFee and medicineCost are numbers only if explicitly mentioned, otherwise null`;

const DEFAULT_NOT_PRESCRIPTION_MESSAGE =
  "Recording doesn't sound like a prescription. Please try again.";

const extractJson = (rawContent) => {
  const text = String(rawContent || '').trim();

  if (!text) {
    throw new Error('Failed to parse AI response');
  }

  const stripped = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(stripped);
  } catch {
    const firstBrace = stripped.indexOf('{');
    const lastBrace = stripped.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(stripped.slice(firstBrace, lastBrace + 1));
    }

    throw new Error('Failed to parse AI response');
  }
};

const isEmptyParsedResult = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return true;

  const medicines = Array.isArray(parsed.medicines) ? parsed.medicines : [];
  const diagnosis = String(parsed.diagnosis || '').trim();
  const notes = String(parsed.notes || '').trim();

  return (
    !diagnosis &&
    !notes &&
    medicines.length === 0 &&
    parsed.consultationFee == null &&
    parsed.medicineCost == null
  );
};

exports.parseTranscript = asyncHandler(async (req, res) => {
  const transcript =
    typeof req.body?.transcript === 'string' ? req.body.transcript.trim() : '';
  const locale =
    typeof req.body?.locale === 'string'
      ? req.body.locale.trim().toLowerCase()
      : 'en';

  if (!transcript) {
    throw new ApiError(400, 'Transcript is required');
  }

  if (transcript.length > 2000) {
    throw new ApiError(400, 'Transcript too long');
  }

  if (!process.env.GROQ_API_KEY) {
    throw new ApiError(500, 'Groq API key not configured');
  }

  try {
    const response = await axios.post(
      GROQ_URL,
      {
        model: MODEL,
        temperature: 0.1,
        max_tokens: 600,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: PARSE_PROMPT },
          {
            role: 'user',
            content: `Locale: ${locale}\nTranscript: ${transcript}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const content = response.data?.choices?.[0]?.message?.content;
    const parsed = extractJson(content);

    if (parsed?.error === 'not_a_prescription' || isEmptyParsedResult(parsed)) {
      throw new ApiError(422, DEFAULT_NOT_PRESCRIPTION_MESSAGE);
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          parsed,
        },
        'Prescription parsed successfully',
      ),
    );
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.response?.status === 422) {
      throw new ApiError(422, DEFAULT_NOT_PRESCRIPTION_MESSAGE);
    }

    if (String(error?.message || '').includes('Failed to parse AI response')) {
      throw new ApiError(500, 'Failed to parse AI response');
    }

    if (error?.response?.status === 429) {
      throw new ApiError(
        500,
        'AI processing failed. You can fill the form manually.',
      );
    }

    throw new ApiError(
      500,
      error?.response?.data?.error?.message ||
        error?.message ||
        'AI processing failed. You can fill the form manually.',
    );
  }
});
