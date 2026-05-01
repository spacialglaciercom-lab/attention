import { AIUntangledData } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const PRIMARY_TIMEOUT_MS = 15000;

interface InferenceResult {
  success: boolean;
  data?: AIUntangledData;
  error?: string;
  provider: 'primary' | 'mistral' | 'mock';
}

const SYSTEM_PROMPT = `You are a cognitive untangler. Analyze the user's raw brain dump and return a structured JSON object with these fields:
- mood: array of 1-3 emotion words (e.g. "anxious", "frustrated", "grateful", "overwhelmed", "calm", "confused", "motivated", "sad", "reflective")
- distortions: array of cognitive distortions present (e.g. "catastrophizing", "mind-reading", "should statements", "all-or-nothing thinking", "personalization", "labeling", "fortune-telling") — use empty array if none detected
- entities: array of proper nouns / named people, projects, or things mentioned — use empty array if none
- themes: array of 2-4 topic keywords (e.g. "work", "relationships", "health", "finances", "creativity", "productivity", "family", "goals") — use ["self-reflection"] if none clear
- summary: a single sentence summarizing the emotional core of the user's reflection, starting with "User is..."
- actionItem: a single concrete, actionable suggestion tailored to the content (one sentence)

Return ONLY valid JSON, no markdown, no explanation.`;

async function callPrimaryLLM(content: string, apiKey: string): Promise<AIUntangledData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PRIMARY_TIMEOUT_MS);

  try {
    const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: content }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty response');

    const parsed: AIUntangledData = JSON.parse(text);
    return {
      mood: parsed.mood || [],
      distortions: parsed.distortions || [],
      entities: parsed.entities || [],
      themes: parsed.themes || [],
      summary: parsed.summary || 'User is reflecting.',
      actionItem: parsed.actionItem || 'Journal further to clarify these thoughts.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function callMistralAPI(content: string, apiKey: string): Promise<AIUntangledData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PRIMARY_TIMEOUT_MS);

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content },
        ],
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Mistral API error ${response.status}: ${errBody.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Mistral returned empty response');

    const parsed: AIUntangledData = JSON.parse(text);
    return {
      mood: parsed.mood || [],
      distortions: parsed.distortions || [],
      entities: parsed.entities || [],
      themes: parsed.themes || [],
      summary: parsed.summary || 'User is reflecting.',
      actionItem: parsed.actionItem || 'Journal further to clarify these thoughts.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export const InferenceService = {
  async untangle(
    content: string,
    options?: { geminiApiKey?: string; mistralApiKey?: string }
  ): Promise<InferenceResult> {
    const geminiKey = options?.geminiApiKey?.trim();
    const mistralKey = options?.mistralApiKey?.trim();

    // Try primary LLM (Gemini) if key is configured
    if (geminiKey) {
      try {
        console.log('[Inference] Calling Gemini API...');
        const data = await callPrimaryLLM(content, geminiKey);
        console.log('[Inference] Gemini succeeded');
        return { success: true, data, provider: 'primary' };
      } catch (primaryError: any) {
        const errorMsg = primaryError?.message || 'Unknown error';
        console.warn(`[Inference] Gemini failed: ${errorMsg}`);
      }
    } else {
      console.log('[Inference] No Gemini API key configured, skipping primary');
    }

    // Fall back to Mistral if API key is configured
    if (mistralKey) {
      try {
        console.log('[Inference] Falling back to Mistral...');
        const data = await callMistralAPI(content, mistralKey);
        console.log('[Inference] Mistral fallback succeeded');
        return { success: true, data, provider: 'mistral' };
      } catch (mistralError: any) {
        console.warn(`[Inference] Mistral fallback also failed: ${mistralError?.message}`);
        return {
          success: false,
          error: `Both Gemini and Mistral failed: ${mistralError?.message}`,
          provider: 'mistral',
        };
      }
    }

    // No API keys — return error
    console.warn('[Inference] No API keys configured. Configure a Gemini or Mistral API key in Settings.');
    return {
      success: false,
      error: 'No API key configured. Add a Gemini or Mistral API key in Settings → AI Settings.',
      provider: 'mock',
    };
  },
};
