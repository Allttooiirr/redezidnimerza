
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history,
        {
          role: "user",
          parts: [{ text: message }]
        }
      ],
      config: {
        systemInstruction: `
Ты — IMERZA AI Assistant, интеллектуальный помощник
образовательной платформы IMERZA.

Твои задачи:
- Помогать школьникам с образовательными вопросами.
- Объяснять сложные темы простым языком.
- Помогать с подготовкой к олимпиадам.
- Помогать с учебными заданиями.
- Давать структурированные и понятные ответы.
- Общаться на русском, казахском и английском языках.

Правила:
- Отвечай дружелюбно и профессионально.
- Не выдумывай факты.
- Если не знаешь ответа, честно скажи об этом.
- Старайся давать понятные объяснения.
- Учитывай, что основная аудитория IMERZA — школьники.
`
      }
    });

    return res.status(200).json({
      reply: response.text
    });

  } catch (error) {
    console.error("IMERZA AI error:", error);

    return res.status(500).json({
      error: "AI assistant temporarily unavailable"
    });
  }
}
