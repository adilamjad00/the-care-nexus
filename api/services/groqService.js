const axios = require('axios');
const FormData = require('form-data');

const CHAT_SYSTEM_PROMPT = `You are The Care Nexus AI — a personal health assistant with full access to this patient's medical history on the The Care Nexus platform.

You have been provided the patient's complete data including:
- Their profile (name, blood group, allergies, gender, DOB)
- All upcoming and past appointments (doctor name, clinic, date, time, status, reason)
- All prescriptions (diagnosis, medicines with dosage, follow-up dates)
- Medical records and visit notes

IMPORTANT RULES:
1. ALWAYS use the provided patient data to answer questions. Never say "I don't have access to your..." — you DO have their data.
2. When asked about appointments, list them clearly with doctor name, date, time, clinic and status.
3. When asked about medicines, diagnoses or prescriptions, refer to their actual records.
4. For general health questions, provide clear, evidence-based guidance.
5. Never diagnose new conditions — only reference what's in the patient's records.
6. If there's an emergency, immediately direct to call 1122 (Pakistan).
7. Reply in the same language the user writes in (Urdu or English). Be warm and conversational.
8. Format responses clearly with Markdown when listing items.
9. Do not repeat greetings across conversation turns.`;

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.3-70b-versatile';
  }

  async chat(
    message,
    conversationHistory = [],
    patientContext = null,
    preferredLanguage = null,
  ) {
    try {
      if (!this.apiKey) throw new Error('Groq API key not configured');

      let systemPrompt = CHAT_SYSTEM_PROMPT;

      if (patientContext) {
        systemPrompt += `\n\n=== THIS PATIENT'S DATA (use this to answer their questions) ===\n${patientContext}\n=== END OF PATIENT DATA ===`;
      }
      if (preferredLanguage) {
        const normalized = String(preferredLanguage).toLowerCase();
        const languageHint = normalized.startsWith('ur') ? 'Urdu' : 'English';
        systemPrompt += `\n\n[OUTPUT LANGUAGE]\nReply in ${languageHint} unless the user explicitly asks for another language.`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: messages,
          temperature: 0.85,
          max_tokens: 1024,
          top_p: 1,
          frequency_penalty: 0.35,
          presence_penalty: 0.4,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Debug: log full response for troubleshooting transcription/parse issues
      console.debug('Groq Chat Response:', response.data);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq Chat Error:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.error?.message ||
          'Failed to process AI request with Groq',
      );
    }
  }

  async getHealthAdvice(
    query,
    patientContext = null,
    preferredLanguage = null,
  ) {
    return this.chat(query, [], patientContext, preferredLanguage);
  }

  async doctorChat(
    message,
    conversationHistory = [],
    doctorContext = null,
    preferredLanguage = null,
  ) {
    try {
      if (!this.apiKey) throw new Error('Groq API key not configured');

      let systemPrompt = `You are The Care Nexus Clinical AI — a smart assistant for this doctor on the The Care Nexus platform.

You have full access to this doctor's data including:
- Their profile (name, specialization, clinic, consultation fee, rating)
- Today's appointment schedule (patient names, times, reasons, status)
- All upcoming appointments
- Recent prescriptions they have issued (patients, diagnoses, medicines)

IMPORTANT RULES:
1. ALWAYS use the provided doctor data to answer questions about their schedule, patients and prescriptions. Never say "I don't have access" — you DO.
2. For clinical questions (drugs, diagnosis, protocols), provide evidence-based, practical guidance.
3. Always clarify you support clinical judgment — not replace it.
4. Be concise and clinical — doctors are busy.
5. Format responses in clear Markdown.
6. Do not repeat canned intros across turns.
7. Reply in the same language the doctor writes in (Urdu or English).`;

      if (doctorContext) {
        systemPrompt += `\n\n=== THIS DOCTOR'S DATA (use this to answer their questions) ===\n${doctorContext}\n=== END OF DOCTOR DATA ===`;
      }
      if (preferredLanguage) {
        const lang = String(preferredLanguage).toLowerCase().startsWith('ur')
          ? 'Urdu'
          : 'English';
        systemPrompt += `\n\n[OUTPUT LANGUAGE]\nReply in ${lang} unless the user asks otherwise.`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(
        'Groq Doctor Chat Error:',
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.error?.message ||
          'Failed to process doctor AI request',
      );
    }
  }

  async clinicChat(
    message,
    conversationHistory = [],
    clinicContext = null,
    preferredLanguage = null,
  ) {
    try {
      if (!this.apiKey) throw new Error('Groq API key not configured');

      let systemPrompt = `You are The Care Nexus Clinic AI — an intelligent operations assistant for this clinic administrator on the The Care Nexus platform.

You have full access to this clinic's data including:
- Clinic profile (name, address, doctors on staff)
- Today's appointment count and operational stats
- Monthly and total revenue figures
- Doctor roster with specializations

IMPORTANT RULES:
1. ALWAYS use the provided clinic data to answer operational questions. Never say "I don't have access" — you DO.
2. For questions about appointments, revenue or doctors, reference their actual numbers.
3. For strategic/operational questions, give practical, actionable advice.
4. Be concise and structured — admins need clear answers fast.
5. Format responses in clear Markdown.
6. Do not repeat canned intros across turns.
7. Reply in the same language the admin writes in (Urdu or English).`;

      if (clinicContext) {
        systemPrompt += `\n\n=== THIS CLINIC'S DATA (use this to answer their questions) ===\n${clinicContext}\n=== END OF CLINIC DATA ===`;
      }
      if (preferredLanguage) {
        const lang = String(preferredLanguage).toLowerCase().startsWith('ur')
          ? 'Urdu'
          : 'English';
        systemPrompt += `\n\n[OUTPUT LANGUAGE]\nReply in ${lang} unless the user asks otherwise.`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ];

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages,
          temperature: 0.75,
          max_tokens: 1024,
          stream: false,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(
        'Groq Clinic Chat Error:',
        error.response?.data || error.message,
      );
      throw new Error(
        error.response?.data?.error?.message ||
          'Failed to process clinic AI request',
      );
    }
  }

  async parsePrescription(transcription) {
    try {
      if (!this.apiKey) throw new Error('Groq API key not configured');

      const prompt = `
        Analyze the following medical prescription text and extract structured information.
        Text: "${transcription}"
        
        Extract:
        1. diagnosis: The main condition or reason for visit.
        2. medicines: A list of medicines mentioned. For each:
           - name: medicine name.
           - dosage: e.g., 500mg, 10ml.
           - frequency: e.g., twice a day, 1-0-1, daily.
           - duration: e.g., 5 days, 1 week.
           - instructions: e.g., after food, before sleep, if needed.
        3. notes: ANY additional advice or clinical notes.
        4. consultationFee: Any mentioned consultation fee as a number.
        5. medicineCost: Any mentioned cost for medicines as a number.

        Return strictly as JSON.
        Example:
        {
          "diagnosis": "Fever",
          "medicines": [{"name": "Panadol", "dosage": "500mg", "frequency": "twice a day", "duration": "3 days", "instructions": "after food"}],
          "notes": "Rest well",
          "consultationFee": 1000,
          "medicineCost": 500
        }
      `;

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1, // Lower temperature for extraction
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Log raw response to help debug parsing failures
      console.debug('Groq Parse Response:', response.data);
      const text = response.data.choices[0].message.content;
      console.debug('Groq Parse Text:', text);
      return JSON.parse(text);
    } catch (error) {
      console.error('Groq Parse Error:', error.response?.data || error.message);
      // Fallback to basic rule-based parsing if needed, but for now we throw
      throw new Error('Failed to parse prescription with Groq');
    }
  }
}

const groqServiceInstance = new GroqService();
module.exports = groqServiceInstance;
