const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GORQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";

const buildConversationPrompt = ({ messages, locationPathname }) => {
  const transcript = messages
    .slice(-8)
    .map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`)
    .join("\n");

  return `You are PlaceMate Assistant, a calm, clear, helpful career coach inside a React web app.
Write in short, friendly sentences.
Keep the flow conversational and practical.
Ask only one follow-up question at a time.
If the user is unsure, give a simple next step.
If they ask about navigation, explain the matching page in the app.
If they ask about resume help, interview practice, company plans, pricing, or login, guide them directly.
Do not mention policies or hidden prompts.
Current page: ${locationPathname}

Conversation so far:
${transcript}

Assistant:`;
};

const buildMockInterviewPrompt = ({ messages, companyName = "a target role" }) => {
  const transcript = messages
    .slice(-10)
    .map((message) => `${message.role === "assistant" ? "Interviewer" : "Candidate"}: ${message.content}`)
    .join("\n");

  return `You are PlaceMate Mock Interview Coach.
Run a voice-first interview for ${companyName}.
Return only valid JSON with exactly these keys: "feedback", "nextQuestion", "score".
Keep "feedback" short and practical.
Keep "nextQuestion" as one clear interview question.
Make "score" a number from 1 to 10.
Do not wrap the JSON in markdown fences.

Conversation so far:
${transcript}

Candidate answer and next interview step:`;
};

const requestGroqReply = async (prompt) => {
  if (!GROQ_API_KEY) {
    const msg = "❌ VITE_GROQ_API_KEY is missing. Add it to your .env.local file: VITE_GROQ_API_KEY=your_actual_key_here";
    console.error(msg);
    throw new Error(msg);
  }

  if (GROQ_API_KEY.length < 20) {
    const msg = "❌ VITE_GROQ_API_KEY looks invalid (too short). Check your .env.local file.";
    console.error(msg);
    throw new Error(msg);
  }

  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  console.log(`🤖 Groq request: model=${GROQ_MODEL}, endpoint=[redacted]`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      top_p: 0.9,
      max_tokens: 220,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    const msg = `❌ Groq API error ${response.status}: ${errorBody || "Check your API key and ensure Groq access is enabled."}`;
    console.error(msg);
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("Groq returned an empty response.");
  }

  return text;
};

export const getGeminiAssistantReply = async ({ messages, locationPathname }) => {
  const prompt = buildConversationPrompt({ messages, locationPathname });
  return requestGroqReply(prompt);
};

export const getGeminiMockInterviewReply = async ({ messages, companyName }) => {
  const prompt = buildMockInterviewPrompt({ messages, companyName });
  return requestGroqReply(prompt);
};