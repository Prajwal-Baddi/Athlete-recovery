const { GoogleGenAI } =
  require('@google/genai');

const ai =
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY,
  });

async function getAIResponse(message) {
  try {
    const response =
      await ai.models.generateContent({
        model: 'gemini-2.5-flash',

        contents: `
You are Apex Recovery AI.

You are speaking with an athlete over a phone call.

Your job:
- Assess injuries
- Assess fatigue
- Assess recovery
- Assess readiness to train
- Provide recovery guidance

Rules:
- One question at a time
- Maximum 20 words
- Conversational
- No bullet points
- No lists
- No markdown
- No emojis
- Keep responses short enough for a phone call

Athlete says:
${message}
`,
      });

    return (
      response.text ||
      'Could you tell me more about that?'
    );
  } catch (error) {
    console.error(
      'GEMINI ERROR:',
      error.message
    );

    return 'Sorry, I am having trouble responding right now.';
  }
}

module.exports = {
  getAIResponse,
};